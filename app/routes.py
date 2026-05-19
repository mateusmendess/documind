import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from .models import User, Document
from .extensions import db, bcrypt

main = Blueprint("main", __name__)

ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@main.route("/")
def index():
    return render_template("index.html")


@main.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name     = request.form.get("name")
        email    = request.form.get("email")
        password = request.form.get("password")

        user_exists = User.query.filter_by(email=email).first()
        if user_exists:
            flash("Este e-mail já está cadastrado.", "error")
            return redirect(url_for("main.register"))

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(name=name, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash("Conta criada com sucesso! Faça login.", "success")
        return redirect(url_for("main.login"))

    return render_template("register.html")


@main.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email    = request.form.get("email")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            flash("Login realizado com sucesso!", "success")
            return redirect(url_for("main.dashboard"))

        flash("E-mail ou senha incorretos.", "error")
        return redirect(url_for("main.login"))

    return render_template("login.html")


@main.route("/dashboard")
@login_required
def dashboard():
    documents = Document.query.filter_by(user_id=current_user.id).order_by(Document.created_at.desc()).all()
    return render_template("dashboard.html", documents=documents)


@main.route("/upload", methods=["GET", "POST"])
@login_required
def upload():
    if request.method == "POST":
        file = request.files.get("file")

        if not file or file.filename == "":
            flash("Nenhum arquivo selecionado.", "error")
            return redirect(url_for("main.upload"))

        if not allowed_file(file.filename):
            flash("Apenas arquivos PDF são permitidos.", "error")
            return redirect(url_for("main.upload"))

        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)

        existing = Document.query.filter_by(filename=filename, user_id=current_user.id).first()
        if existing:
            flash("Você já enviou um documento com esse nome.", "error")
            return redirect(url_for("main.upload"))

        file.save(filepath)

        doc = Document(
            filename=filename,
            filepath=filepath,
            user_id=current_user.id
        )
        db.session.add(doc)
        db.session.commit()

        flash("PDF enviado com sucesso!", "success")
        return redirect(url_for("main.dashboard"))

    return render_template("upload.html")


@main.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logout realizado com sucesso!", "success")
    return redirect(url_for("main.login"))
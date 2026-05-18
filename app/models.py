from .extensions import db, login_manager
from flask_login import UserMixin
from datetime import datetime


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(UserMixin, db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(100), nullable=False)
    email    = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    documents = db.relationship("Document", backref="owner", lazy=True)

    def __repr__(self):
        return f"<User {self.email}>"


class Document(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    filename   = db.Column(db.String(255), nullable=False)
    filepath   = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    messages = db.relationship("Message", backref="document", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Document {self.filename}>"


class Message(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    question    = db.Column(db.Text, nullable=False)
    answer      = db.Column(db.Text, nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"), nullable=False)

    def __repr__(self):
        return f"<Message {self.id}>"
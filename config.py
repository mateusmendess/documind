import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "chave-dev-documind"
    
    uri = os.environ.get("DATABASE_URL") or "sqlite:///documind.db"
    if uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+pg8000://", 1)
    elif uri.startswith("postgresql://"):
        uri = uri.replace("postgresql://", "postgresql+pg8000://", 1)
    SQLALCHEMY_DATABASE_URI = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB máximo por arquivo

    GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
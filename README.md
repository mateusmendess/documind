# 📄 DocuMind
Aplicação web de chat inteligente com PDFs usando RAG (Retrieval-Augmented Generation) — faça upload de qualquer PDF e converse com o conteúdo usando IA — desenvolvida em Flask.

![Deploy](https://img.shields.io/badge/DEPLOY-RAILWAY-6366f1?style=for-the-badge)
![Python](https://img.shields.io/badge/PYTHON-3.10+-3b82f6?style=for-the-badge)
![Flask](https://img.shields.io/badge/FLASK-2.x-10b981?style=for-the-badge)
![SQLAlchemy](https://img.shields.io/badge/SQLALCHEMY-3.0-f59e0b?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-ES6+-f59e0b?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/POSTGRESQL-pg8000-336791?style=for-the-badge)

## 🌐 Demo
Acesse o projeto online: [documind-ai.up.railway.app](https://documind-ai.up.railway.app)

## 🎬 Demonstração
*Em breve*

## 📸 Screenshots
*Em breve*

## 🚀 Funcionalidades

### Autenticação
- Cadastro e login de usuários
- Logout seguro
- Login automático após cadastro
- Proteção de rotas com Flask-Login

### Documentos
- Upload de PDFs com drag & drop
- Barra de progresso real durante o envio
- Extração automática de texto com PyMuPDF
- Indexação com ChromaDB e embeddings
- Exclusão com confirmação modal
- Listagem com metadados (data e número de conversas)

### Chat com IA
- Respostas baseadas exclusivamente no conteúdo do PDF (RAG)
- Múltiplas conversas por documento
- Histórico completo de mensagens
- Envio via AJAX — sem reload da página
- Renderização de markdown nas respostas (negrito, listas, código)
- Botão copiar resposta com feedback visual
- Renomeação inline de conversas na sidebar
- Typing indicator animado durante processamento
- Scroll automático suave

### UX e Design
- Design Dark Tech com tema verde esmeralda
- Toast notifications animadas para feedback
- Páginas de erro 404 e 500 customizadas
- Favicon SVG personalizado
- Scrollbar estilizada no padrão dark

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Python, Flask |
| Banco de dados | SQLite (local) / PostgreSQL (produção) |
| ORM | SQLAlchemy, Flask-SQLAlchemy |
| Autenticação | Flask-Login, Flask-Bcrypt |
| IA | Groq API, LangChain |
| Embeddings | ChromaDB, SentenceTransformers |
| Extração de PDF | PyMuPDF (fitz) |
| Frontend | HTML5, CSS3, JavaScript |
| Deploy | Railway |

## 📁 Estrutura do projeto
documind/
├── app/
│   ├── init.py
│   ├── extensions.py
│   ├── models.py
│   ├── routes.py
│   ├── pdf_service.py
│   ├── ai_service.py
│   ├── rag_service.py
│   ├── static/
│   │   ├── css/style.css
│   │   ├── js/script.js
│   │   └── favicon.svg
│   └── templates/
│       ├── base.html
│       ├── index.html
│       ├── dashboard.html
│       ├── upload.html
│       ├── chat.html
│       ├── login.html
│       ├── register.html
│       ├── 404.html
│       └── 500.html
├── uploads/
├── chroma_db/
├── config.py
├── run.py
├── requirements.txt
└── Procfile

## ⚙️ Como rodar localmente

### Pré-requisitos
- Python 3.10+
- pip
- Conta na [Groq](https://console.groq.com) para obter a API key

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/mateusmendess/documind.git
cd documind
```

**2. Crie e ative o ambiente virtual**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

**3. Instale as dependências**
```bash
pip install -r requirements.txt
```

**4. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
SECRET_KEY=sua-chave-secreta-aqui
GROQ_API_KEY=sua-chave-groq-aqui
FLASK_ENV=development

**5. Rode o projeto**
```bash
python run.py
```

**6. Acesse no navegador**
http://localhost:5000

## 👨‍💻 Autor
Feito por Mateus Mendes

[![GitHub](https://img.shields.io/badge/GitHub-mateusmendess-181717?style=for-the-badge&logo=github)](https://github.com/mateusmendess)

## 📄 Licença
Este projeto está sob a licença MIT.
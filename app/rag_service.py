import os
import chromadb
from chromadb.utils import embedding_functions

# Diretório onde o ChromaDB vai salvar os dados
CHROMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'chroma_db')

# Função de embedding — usa o modelo local da Sentence Transformers
# Roda offline, sem custo de API
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

def get_chroma_client():
    """Retorna um cliente ChromaDB persistente no disco."""
    return chromadb.PersistentClient(path=CHROMA_PATH)

def get_collection(doc_id: int):
    """
    Retorna (ou cria) uma coleção ChromaDB para um documento específico.
    Cada documento tem sua própria coleção isolada.
    """
    client = get_chroma_client()
    collection_name = f"doc_{doc_id}"
    return client.get_or_create_collection(
        name=collection_name,
        embedding_function=embedding_fn
    )

def split_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """
    Divide o texto em chunks com sobreposição.
    
    chunk_size: tamanho de cada pedaço em caracteres
    overlap: quantos caracteres do chunk anterior são repetidos no próximo
             (evita perder contexto na divisão)
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():  # ignora chunks vazios
            chunks.append(chunk)
        start += chunk_size - overlap  # avança com sobreposição
    return chunks

def index_document(doc_id: int, text: str):
    """
    Processa e indexa um documento no ChromaDB.
    Chamado uma vez no upload do PDF.
    """
    collection = get_collection(doc_id)

    # Se já foi indexado antes, não faz nada
    if collection.count() > 0:
        return

    chunks = split_text(text)

    # ChromaDB precisa de: documentos, ids únicos e (opcional) metadados
    collection.add(
        documents=chunks,
        ids=[f"chunk_{i}" for i in range(len(chunks))],
        metadatas=[{"chunk_index": i} for i in range(len(chunks))]
    )

def search_chunks(doc_id: int, question: str, n_results: int = 4) -> str:
    """
    Busca os chunks mais relevantes para a pergunta.
    Se o documento ainda não foi indexado, indexa antes de buscar.
    """
    from .models import Document  # import local para evitar circular import
    
    collection = get_collection(doc_id)

    # Se não foi indexado ainda, indexa agora
    if collection.count() == 0:
        doc = Document.query.get(doc_id)
        if doc and doc.extracted_text:
            chunks = split_text(doc.extracted_text)
            collection.add(
                documents=chunks,
                ids=[f"chunk_{i}" for i in range(len(chunks))],
                metadatas=[{"chunk_index": i} for i in range(len(chunks))]
            )

    total = collection.count()
    
    # Garante que n_results seja pelo menos 1
    safe_n = max(1, min(n_results, total))
    
    results = collection.query(
        query_texts=[question],
        n_results=safe_n
    )
    chunks = results["documents"][0]
    return "\n\n---\n\n".join(chunks)
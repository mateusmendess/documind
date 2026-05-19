from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
import os

def ask_question(document_text: str, question: str) -> str:
    """
    Recebe o texto extraído do PDF e uma pergunta do usuário.
    Retorna a resposta gerada pelo LLM.
    """
    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama-3.3-70b-versatile"  # modelo gratuito na Groq
    )

    messages = [
        SystemMessage(content=f"""Você é um assistente especializado em análise de documentos.
Use APENAS as informações do documento abaixo para responder.
Se a resposta não estiver no documento, diga que não encontrou a informação.

DOCUMENTO:
{document_text}
"""),
        HumanMessage(content=question)
    ]

    response = llm.invoke(messages)
    return response.content
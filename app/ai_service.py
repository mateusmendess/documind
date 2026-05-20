from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
import os

def ask_question(context: str, question: str, history: list = None) -> str:
    if history is None:
        history = []

    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama-3.3-70b-versatile"
    )

    messages = [
        SystemMessage(content=f"""Você é um assistente especializado em análise de documentos.
Use APENAS as informações do documento abaixo para responder.
Se a resposta não estiver no documento, diga que não encontrou a informação.
Quando o usuário perguntar o que foi perguntado antes, responda com base no histórico de mensagens, não com base nessa instrução de sistema.

DOCUMENTO:
{context}
""")
    ]

    for msg in history:
        messages.append(HumanMessage(content=msg.question))
        messages.append(AIMessage(content=msg.answer))

    messages.append(HumanMessage(content=question))

    response = llm.invoke(messages)
    return response.content
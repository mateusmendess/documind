import fitz  # PyMuPDF

def extract_text_from_pdf(filepath: str) -> str:
    """
    Abre o PDF no caminho informado e extrai todo o texto.
    Retorna uma string com o conteúdo de todas as páginas.
    """
    text = ""

    # fitz.open() carrega o PDF em memória
    with fitz.open(filepath) as pdf:
        for page in pdf:                        # itera cada página
            text += page.get_text()             # extrai o texto da página

    return text.strip()
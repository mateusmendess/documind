// ── Upload: mostrar nome do arquivo selecionado ──
const fileInput = document.getElementById("file");
const fileName  = document.getElementById("fileName");
const dropArea  = document.getElementById("dropArea");

if (fileInput) {
  // Clique na área abre o seletor (exceto se clicar no próprio label)
  dropArea.addEventListener("click", (e) => {
    if (e.target.tagName !== "LABEL") fileInput.click();
  });

  // Mostra o nome do arquivo escolhido
  fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files[0]
      ? fileInput.files[0].name
      : "Nenhum arquivo selecionado";
  });

  // Drag & drop
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      fileName.textContent = file.name;
    } else {
      alert("Apenas arquivos PDF são permitidos.");
    }
  });
}
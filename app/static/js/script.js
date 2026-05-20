// ── Upload ──
const fileInput = document.getElementById("file");
const fileName  = document.getElementById("fileName");
const dropArea  = document.getElementById("dropArea");

if (fileInput) {
  dropArea.addEventListener("click", (e) => {
    if (e.target.tagName !== "LABEL") fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files[0]
      ? fileInput.files[0].name
      : "Nenhum arquivo selecionado";
  });

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

// ── Chat ──
const chatForm = document.getElementById("chatForm");
if (chatForm) {
  const chatMessages    = document.getElementById("chatMessages");
  const typingIndicator = document.getElementById("typingIndicator");
  const questionInput   = document.getElementById("questionInput");
  const sendBtn         = document.getElementById("sendBtn");
  const chatCounter     = document.getElementById("chatCounter");

  // Scroll para o final ao carregar
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 150);

  // Contador de caracteres
  questionInput.addEventListener("input", () => {
    const len = questionInput.value.length;
    chatCounter.textContent = `${len} / 500`;
    chatCounter.style.color = len > 450 ? "#ef4444" : "#6b7280";
  });

  // Submit
  chatForm.addEventListener("submit", () => {
    const question = questionInput.value.trim();
    if (!question) return;

    const userRow = document.createElement("div");
    userRow.className = "chat-row user-row";
    userRow.innerHTML = `<div class="chat-bubble user-bubble">${question}</div>`;
    chatMessages.insertBefore(userRow, typingIndicator);

    typingIndicator.style.display = "flex";

    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
      questionInput.disabled = true;
      sendBtn.disabled = true;
    }, 0);
  });
}
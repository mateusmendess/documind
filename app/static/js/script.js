// ── Toast Notifications ──
function showToast(message, category) {
  const container = document.getElementById('toast-container');

  const icons = {
    success: 'ti-circle-check',
    error:   'ti-circle-x'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${category}`;
  toast.innerHTML = `
    <i class="ti ${icons[category] || 'ti-info-circle'}" aria-hidden="true"></i>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" aria-label="Fechar">
      <i class="ti ti-x" aria-hidden="true"></i>
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  toast.querySelector('.toast-close').addEventListener('click', () => closeToast(toast));
  setTimeout(() => closeToast(toast), 4000);
}

function closeToast(toast) {
  toast.classList.remove('show');
  toast.classList.add('hide');
  setTimeout(() => toast.remove(), 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const flashData = document.getElementById('flash-data');
  if (!flashData) return;

  flashData.querySelectorAll('span').forEach((el, i) => {
    setTimeout(() => {
      showToast(el.dataset.message, el.dataset.category);
    }, i * 150);
  });
});

// ── Modal de exclusão de documento ──
document.addEventListener('DOMContentLoaded', () => {
  const modal      = document.getElementById('deleteModal');
  const deleteForm = document.getElementById('deleteForm');
  const modalName  = document.getElementById('modalDocName');
  const cancelBtn  = document.getElementById('modalCancel');

  if (!modal) return;

  document.querySelectorAll('.btn-delete-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId   = btn.dataset.docId;
      const docName = btn.dataset.docName;

      modalName.textContent  = docName;
      deleteForm.action      = `/document/${docId}/delete`;
      modal.style.display    = 'flex';
    });
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

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
      showToast("Apenas arquivos PDF são permitidos.", "error");
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

  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 150);

  questionInput.addEventListener("input", () => {
    const len = questionInput.value.length;
    chatCounter.textContent = `${len} / 500`;
    chatCounter.style.color = len > 450 ? "#ef4444" : "#6b7280";
  });

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
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
  const chatMessages     = document.getElementById("chatMessages");
  const typingIndicator  = document.getElementById("typingIndicator");
  const questionInput    = document.getElementById("questionInput");
  const sendBtn          = document.getElementById("sendBtn");
  const chatCounter      = document.getElementById("chatCounter");

  // Renderiza markdown simples nas bubbles da IA
  function renderMarkdown(text) {
    return text
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^#{1,3}\s(.+)/gm, '<strong>$1</strong>')
      .replace(/^\s*[-*]\s(.+)/gm, '• $1')
      .replace(/\n/g, '<br>');
  }

  // Aplica markdown em todas as bubbles já carregadas
  document.querySelectorAll('.ai-bubble[data-raw]').forEach(bubble => {
    bubble.innerHTML = renderMarkdown(bubble.dataset.raw);
  });

  // Scroll para o final
  function scrollToBottom() {
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
  }

  setTimeout(scrollToBottom, 150);

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
    questionInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="ti ti-loader"></i>';

    setTimeout(scrollToBottom, 0);
  });

  // Botão copiar resposta
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;

    const text = btn.dataset.text || btn.closest('.ai-bubble-wrap')?.querySelector('.ai-bubble')?.dataset.raw || '';
    navigator.clipboard.writeText(text).then(() => {
      btn.innerHTML = '<i class="ti ti-check"></i> Copiado!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<i class="ti ti-copy"></i> Copiar';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

// ── Upload com progresso ──
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', (e) => {
    const fileInput = document.getElementById('file');
    if (!fileInput.files[0]) return;

    e.preventDefault();

    const progressWrap  = document.getElementById('progressWrap');
    const progressFill  = document.getElementById('progressFill');
    const progressPct   = document.getElementById('progressPct');
    const progressLabel = document.getElementById('progressLabel');
    const progressStatus = document.getElementById('progressStatus');
    const uploadBtn     = document.getElementById('uploadBtn');
    const dropArea      = document.getElementById('dropArea');

    progressWrap.style.display = 'flex';
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="ti ti-loader"></i> Enviando...';
    dropArea.style.pointerEvents = 'none';
    dropArea.style.opacity = '0.6';

    const formData = new FormData(uploadForm);
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      progressFill.style.width = pct + '%';
      progressPct.textContent  = pct + '%';

      if (pct < 100) {
        progressLabel.textContent  = 'Enviando arquivo...';
        progressStatus.textContent = `${(e.loaded / 1024 / 1024).toFixed(1)} MB de ${(e.total / 1024 / 1024).toFixed(1)} MB`;
      } else {
        progressLabel.textContent  = 'Indexando documento com IA...';
        progressStatus.textContent = 'Isso pode levar alguns segundos...';
        uploadBtn.innerHTML = '<i class="ti ti-brain"></i> Indexando...';
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.responseURL) {
        window.location.href = xhr.responseURL;
      } else {
        window.location.href = '/dashboard';
      }
    });

    xhr.addEventListener('error', () => {
      showToast('Erro ao enviar o arquivo. Tente novamente.', 'error');
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<i class="ti ti-upload"></i> Enviar PDF';
      progressWrap.style.display = 'none';
      dropArea.style.pointerEvents = 'auto';
      dropArea.style.opacity = '1';
    });

    xhr.open('POST', uploadForm.action || window.location.href);
    xhr.send(formData);
  });
}
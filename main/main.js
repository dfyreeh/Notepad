document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

const bloc_notes = document.getElementById("bloc_notes");
const ul = document.getElementById("bloc1_ul");
const modalInputName = document.getElementById("modalInputName");
const modalInputTopic = document.getElementById("modalInputTopic");
const buttonAddNote = document.getElementById("buttonAddNote");
const container_number_notes = document.getElementById("container_number_notes");
const charCount_1 = document.getElementById("charCount_1");
const charCount_2 = document.getElementById("charCount_2");
const staticBackdrop = new bootstrap.Modal(document.getElementById('staticBackdrop'));
const container_textarea = document.getElementById("container_textarea");
const textarea = document.getElementById("textarea");
const searchInput = document.getElementById("searchInput");

let currentSearchTerm = "";

modalInputName.addEventListener("input", () => {
  const maxLength = modalInputName.getAttribute("maxlength");
  const currentLength = modalInputName.value.length;
  charCount_1.textContent = `Введено: ${currentLength} / ${maxLength}`;
});

modalInputTopic.addEventListener("input", () => {
  const maxLength = modalInputTopic.getAttribute("maxlength");
  const currentLength = modalInputTopic.value.length;
  charCount_2.textContent = `Введено: ${currentLength} / ${maxLength}`;
});

function validateInputs() {
  if (modalInputName.value.trim() !== "" && modalInputTopic.value.trim() !== "") {
    buttonAddNote.removeAttribute("disabled");
  } else {
    buttonAddNote.setAttribute("disabled", "true");
  }
}

modalInputName.addEventListener("input", validateInputs);
modalInputTopic.addEventListener("input", validateInputs);

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  ul.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.classList.add("note-item");

    const noteDate = new Date(note.date).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    li.innerHTML = `
        <div class="note-title">${note.title}</div>
        <div class="note-meta">
          <span class="note-topic">${note.topic}</span>
          <span class="note-date">${noteDate}</span>
        </div>
      `;

    li.dataset.noteId = note.id;
    ul.prepend(li);

    if (index === 0) {
      li.classList.add("active");
      loadNoteContent(note.id);
    }
  });

  updateNoteCount();
}

function updateNoteCount() {
  let numberNotesElement = document.getElementById("number_notes");
  if (numberNotesElement) {
    numberNotesElement.textContent = `Кількість нотатків (${ul.children.length})`;
  } else {
    container_number_notes.insertAdjacentHTML('beforeend', `<p id="number_notes" class="number_notes">Кількість нотатків (${ul.children.length})</p>`);
  }
}

buttonAddNote.addEventListener("click", () => {
  const now = new Date();
  const timeString = now.toISOString();

  const newNote = {
    id: Date.now(),
    title: modalInputName.value.trim(),
    topic: modalInputTopic.value.trim(),
    text: "",
    date: timeString
  };

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));

  modalInputName.value = '';
  modalInputTopic.value = '';
  staticBackdrop.hide();
  loadNotes();
});

ul.addEventListener("click", (event) => {
  const clickedElement = event.target.closest("li");

  if (clickedElement) {
    document.querySelectorAll(".note-item").forEach(li => li.classList.remove("active"));

    clickedElement.classList.add("active");

    const noteId = clickedElement.dataset.noteId;
    loadNoteContent(noteId);
  }
});

function loadNoteContent(noteId) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const note = notes.find(n => n.id == noteId);
  if (note) {
    textarea.value = note.text;
    textarea.dataset.noteId = note.id;
  }
}

textarea.addEventListener("input", () => {
  const noteId = textarea.dataset.noteId;
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const note = notes.find(n => n.id == noteId);
  if (note) {
    note.text = textarea.value;
    localStorage.setItem("notes", JSON.stringify(notes));
  }
});

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  currentSearchTerm = searchTerm;

  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.forEach(note => {
    const noteItem = document.querySelector(`[data-note-id="${note.id}"]`);
    const noteTitle = note.title.toLowerCase();
    const noteText = note.text.toLowerCase();

    if (noteTitle.includes(searchTerm) || noteText.includes(searchTerm)) {
      const firstNote = ul.querySelector("li");
      ul.insertBefore(noteItem, firstNote);
    }
  });
});

loadNotes();

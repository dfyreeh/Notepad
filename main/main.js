document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

const bloc_notes = document.getElementById("bloc_notes")
const ul = document.getElementById("bloc1_ul")
const modalInputName = document.getElementById("modalInputName")
const modalInputTopic = document.getElementById("modalInputTopic")


const buttonAddNote = document.getElementById("buttonAddNote")
const container_number_notes = document.getElementById("container_number_notes")
const charCount_1 = document.getElementById("charCount_1")
const charCount_2 = document.getElementById("charCount_2")

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

container_number_notes.insertAdjacentHTML('beforeend', `<p id="number_notes" class="number_notes">Кількість нотатків (${ul.children.length})</p>`);

function validateInputs() {
  if (modalInputName.value.trim() !== "" && modalInputTopic.value.trim() !== "") {
    buttonAddNote.removeAttribute("disabled");
  } else {
    buttonAddNote.setAttribute("disabled", "true");
  }
}

// Проверяем ввод каждый раз, когда меняется текст
modalInputName.addEventListener("input", validateInputs);
modalInputTopic.addEventListener("input", validateInputs);


buttonAddNote.addEventListener("click", () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  // Добавляем новую заметку в список
  ul.insertAdjacentHTML('beforeend', `
    <li>
      ${modalInputName.value}
      <p><span>${timeString}</span> ${modalInputTopic.value}</p>
      <div class="remove">
        <button type="button" class="btn" data-bs-toggle="tooltip" data-bs-placement="right" title="Видалити нотаток">
          <img src="./img/icons8-крестик-78.png" alt="" />
        </button>
      </div>
    </li>
  `);

  // Находим элемент для количества заметок
  let numberNotesElement = document.getElementById("number_notes");

  if (numberNotesElement) {
    // Если элемент уже есть, просто обновляем его текст
    numberNotesElement.textContent = `Кількість нотатків (${ul.children.length})`;
  } else {
    // Если элемента нет, создаем новый
    container_number_notes.insertAdjacentHTML('beforeend', `
      <p id="number_notes" class="number_notes">Кількість нотатків (${ul.children.length})</p>
    `);
  }

  // **Переинициализация Bootstrap tooltip для новых элементов**
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
  modalInputName.value = '';
  modalInputTopic.value = '';
});

ul.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    document.querySelectorAll(".activ").forEach(item => {
      item.classList.remove("activ");
    });
    event.target.classList.add("activ");
  }
});


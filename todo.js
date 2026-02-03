const txt = document.querySelector(".textbox");
const dateInput = document.querySelector(".date");
const timeInput = document.querySelector(".time");
const print = document.querySelector(".body");
const paraText = document.querySelector(".para");
const alarm = document.getElementById("alarmSound");

let store = [];
let edit_id = null;

const data = localStorage.getItem("tasks");
if (data) store = JSON.parse(data);

if ("Notification" in window) {
  Notification.requestPermission();
}

function btnclick() {
  const task = txt.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!task) {
    alert("Enter a task");
    return;
  }

  const reminder = date && time ? `${date}T${time}` : null;

  if (edit_id !== null) {
    store[edit_id] = { task, reminder, notified: false };
    edit_id = null;
    paraText.innerText = "Add Task";
  } else {
    store.push({ task, reminder, notified: false });
  }

  txt.value = "";
  dateInput.value = "";
  timeInput.value = "";

  saveAndDisplay();
}

function saveAndDisplay() {
  localStorage.setItem("tasks", JSON.stringify(store));
  display();
}

function display() {
  print.innerHTML = "";

  store.forEach((item, index) => {
    const div = document.createElement("div");
    div.className =
      "bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow flex justify-between";

    div.innerHTML = `
      <div>
        <p class="font-medium text-gray-800 dark:text-white">${item.task}</p>
        ${
          item.reminder
            ? `<p class="text-sm text-gray-500 dark:text-gray-300">
                ⏰ ${new Date(item.reminder).toLocaleString()}
              </p>`
            : ""
        }
      </div>

      <div class="flex gap-2">
        <button onclick="edit(${index})" class="text-blue-500 text-sm">
          Edit
        </button>
        <button onclick="del(${index})" class="text-red-500 font-bold">
          ✕
        </button>
      </div>
    `;

    print.appendChild(div);
  });
}

function del(index) {
  store.splice(index, 1);
  saveAndDisplay();
}

function edit(index) {
  const item = store[index];
  txt.value = item.task;

  if (item.reminder) {
    const [d, t] = item.reminder.split("T");
    dateInput.value = d;
    timeInput.value = t;
  }

  edit_id = index;
  paraText.innerText = "Save Task";
}

setInterval(() => {
  const now = new Date();

  store.forEach(item => {
    if (item.reminder && !item.notified && new Date(item.reminder) <= now) {
      if (Notification.permission === "granted") {
        new Notification("⏰ Task Reminder", { body: item.task });
      }
      alarm.play();
      item.notified = true;
      saveAndDisplay();
    }
  });
}, 30000);

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

display();

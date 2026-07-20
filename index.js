let addInput = document.querySelector("#addInput"); //input
let addBtn = document.querySelector(".addBtn");
let list = document.querySelector(".list");
let deleteAllBtn = document.querySelector(".deleteAllBtn")
let taskCounter = document.getElementById("taskCounter");
let searchInput = document.getElementById("searchInput");

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function storeTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(tasks = getTasks()) {
  list.innerHTML = "";

  tasks.forEach(task => {
    const text = document.createElement("span");
    const li = document.createElement("li");
    const taskCompleted = document.createElement("input")
    const editTask = document.createElement("button")
    const delBtn = document.createElement("button");


    delBtn.id = "delBtn";
    delBtn.innerText = "Delete";

    text.innerText = task.text;

    delBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });


    taskCompleted.type = "checkbox"
    taskCompleted.checked = task.completed;
    taskCompleted.id = "completedTask"
    taskCompleted.addEventListener("change", () => {
      const tasks = getTasks();

      const updatedTasks = tasks.map((t) => {
        if (t.id === task.id) {
          t.completed = taskCompleted.checked;
        }
        return t;
      })
      storeTasks(updatedTasks);
      renderTasks();
    })

    editTask.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.id = "editText"

      const saveBtn = document.createElement("button");
      saveBtn.innerText = "Save";
      saveBtn.id = "saveBtn"

      li.replaceChild(input, text);
      li.replaceChild(saveBtn, editTask)

      saveBtn.addEventListener("click", () => {
        const updatedText = input.value.trim();

        if (!updatedText) return;

        const tasks = getTasks();

        const updatedTasks = tasks.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              text: updatedText
            };
          }
          return t;
        });

        storeTasks(updatedTasks);
        renderTasks();
      })
    })

    editTask.innerText = "Edit Task";
    editTask.id = "editTask";

    li.appendChild(taskCompleted)
    li.appendChild(text)
    li.appendChild(editTask)
    li.appendChild(delBtn);
    list.appendChild(li);

    if (task.completed) {
      text.style.textDecoration = "line-through";
      li.style.opacity = "0.4";
    }
    else {
      text.style.textDecoration = "none";
    }
  })

  let totalTask = tasks.length;
  let completedTask = tasks.filter(task => task.completed).length;
  let RemainingTask = totalTask - completedTask;

  taskCounter.innerText = `
  Total : ${totalTask} | Completed : ${completedTask} | Remaining : ${RemainingTask}
  `;
}

function addTask(text) {
  const tasks = getTasks();

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
  })

  storeTasks(tasks);
  renderTasks();
}

function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);

  storeTasks(tasks)
  renderTasks();
}

addBtn.addEventListener("click", () => {
  const value = addInput.value.trim();
  if (!value) return;
  addTask(value);
  addInput.value = "";
})

addInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
})

function deleteAllTasks() {
  const confirmDelete = confirm("Are you sure you want to delete all")

  if (!confirmDelete) {
    return;
  }

  localStorage.removeItem("tasks");
  renderTasks();
}

deleteAllBtn.addEventListener("click", () => {
  deleteAllTasks();
})

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const tasks = getTasks();
  const searchResult = tasks.filter(task => {
    return task.text.toLowerCase().includes(value);
  })
  renderTasks(searchResult);
})

renderTasks();

class TaskLists {
  constructor() {
    this.taskArray = [];
    this.taskId = 0;
    this.currentSort = null;
  }

  addTask(name, date, priority) {
    this.taskArray.push({
      id: this.taskId++,
      name,
      date,
      formattedDate: this.formatDate(date),
      priority,
    });
    this.renderTasks();
    this.applyCurrentSort();
  }

  formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  }

  createTaskDOM(task) {
    const containerForTask = document.createElement("div");
    const containerForTaskName = document.createElement("div");
    const containerForDateAndPriority = document.createElement("div");
    const containerForTaskText = document.createElement("div");
    const containerForDateText = document.createElement("div");
    const containerForPriorityText = document.createElement("div");
    const containerForCheckBox = document.createElement("div");
    const containerForPencil = document.createElement("div");

    const imageForPencil = document.createElement("img");
    const imageForCheckmark = document.createElement("img");

    containerForPriorityText.classList.add("priority");
    containerForDateText.classList.add("date");
    containerForTask.classList.add("container");
    containerForDateAndPriority.classList.add("datescontainer");
    containerForTaskName.classList.add("taskcontainertwo");
    imageForCheckmark.classList.add("checkmark");
    containerForCheckBox.classList.add("checkbox");
    containerForTask.id = task.id;

    containerForPriorityText.textContent = task.priority;
    containerForDateText.textContent = task.formattedDate;
    containerForTaskText.textContent = task.name;

    if (task.priority === "LOW") {
      containerForPriorityText.style.color = "lightgreen";
      containerForPriorityText.style.textShadow =
        "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black";
    } else if (task.priority === "MEDIUM") {
      containerForPriorityText.style.color = "yellow";
      containerForPriorityText.style.textShadow =
        "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black";
    } else {
      containerForPriorityText.style.color = "rgb(255, 111, 111)";
      containerForPriorityText.style.textShadow =
        "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black";
    }

    imageForCheckmark.src = "check.jpeg";
    imageForPencil.src = "pngwing.com.png";
    imageForPencil.style.cursor = "pointer";
    imageForCheckmark.style.visibility = "hidden";

    containerForCheckBox.appendChild(imageForCheckmark);
    containerForPencil.appendChild(imageForPencil);
    containerForDateAndPriority.append(
      containerForPriorityText,
      containerForDateText
    );
    containerForTaskName.append(
      containerForCheckBox,
      containerForTaskText,
      containerForPencil
    );
    containerForTask.append(containerForTaskName, containerForDateAndPriority);

    imageForPencil.addEventListener("click", () => {
      this.openEditPopup(task.id);
    });
    containerForCheckBox.addEventListener("click", () => {
      imageForCheckmark.style.visibility =
        imageForCheckmark.style.visibility === "hidden" ? "visible" : "hidden";
    });

    return containerForTask;
  }

  renderTasks() {
    taskContainer.innerHTML = "";
    this.taskArray.forEach((task) => {
      const taskDOM = this.createTaskDOM(task);
      taskContainer.appendChild(taskDOM);
    });
  }

  deleteTask(taskId) {
    this.taskArray = this.taskArray.filter((task) => task.id !== taskId);
    this.renderTasks();
    this.applyCurrentSort();
  }

  sortTask(type) {
    let copyArray = [];
    const priorityArray = ["HIGH", "MEDIUM", "LOW"];
    if (type === "priority") {
      for (let j = 0; j < priorityArray.length; j++) {
        for (let i = 0; i < this.taskArray.length; i++) {
          if (this.taskArray[i].priority === priorityArray[j]) {
            copyArray.push(this.taskArray[i]);
          }
        }
      }
    } else if (type === "dueDate") {
      this.taskArray.sort((task1, task2) => {
        //Return a negative to tell the sort function to put task1.date before
        //task2.date
        if (task1.date < task2.date) return -1;
        // a comes after b
        if (task1.date > task2.date) return 1;
        // a and b are equal
        return 0;
      });
      copyArray = this.taskArray;
    }
    this.taskArray = copyArray;
    this.currentSort = type;
    this.renderTasks();
  }
  openEditPopup(taskId) {
    const task = this.taskArray.find((task) => task.id === taskId);
    const editPopup = document.querySelector("#edit");
    const editTaskInput = document.querySelector("#taskinputtwo");
    const editDateInput = document.querySelector("#dateinputtwo");
    const editPriorityInputs = document.querySelectorAll(
      'input[name="priorityinputtwo"]'
    );

    // Populate the popup with task details
    editTaskInput.value = task.name;
    editDateInput.value = task.date;
    editPriorityInputs.forEach((input) => {
      input.checked = input.value === task.priority;
    });

    editPopup.style.display = "block";
    body.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    body.style.pointerEvents = "none";
    editPopup.style.pointerEvents = "auto";

    // Add delete functionality
    document.querySelector("#delete").onclick = () => {
      this.deleteTask(taskId);
      saveTasks();
      editPopup.style.display = "none";
      body.style.backgroundColor = "white";
      body.style.pointerEvents = "auto";
    };

    // Add edit functionality
    document.querySelector("#Editing").onclick = (e) => {
      e.preventDefault();
      const updatedName = editTaskInput.value;
      const updatedDate = editDateInput.value;
      const updatedPriority = document.querySelector(
        'input[name="priorityinputtwo"]:checked'
      ).value;

      // Update the task
      task.name = updatedName;
      task.date = updatedDate;
      task.formattedDate = this.formatDate(updatedDate);
      task.priority = updatedPriority;

      this.renderTasks();
      this.applyCurrentSort();
      saveTasks();
      editPopup.style.display = "none";
      editPopup.style.pointerEvents = "none";
      body.style.backgroundColor = "white";
      body.style.pointerEvents = "auto";
    };
  }

  deleteTask(taskId) {
    this.taskArray = this.taskArray.filter((task) => task.id !== taskId);
    this.renderTasks();
  }
  applyCurrentSort() {
    if (this.currentSort) {
      this.sortTask(this.currentSort); // Reapply the last sort
    }
  }
}

const taskList = new TaskLists();
const taskButton = document.querySelector("#add");
const form = document.querySelector("form");
const popup = document.querySelector("#popup");
const body = document.querySelector("body");
const closeButtons = document.querySelectorAll(".closebutton");
const editorPopUp = document.querySelector("#edit");
const taskContainer = document.querySelector("#taskContainer");
function saveTasks() {
  const data = {
    taskArray: taskList.taskArray,
    taskId: taskList.taskId,
  };
  localStorage.setItem("Tasks", JSON.stringify(data));
}

function loadTasks() {
  let savedData = localStorage.getItem("Tasks");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // Ensure taskArray is an array and taskId is restored
    taskList.taskArray = Array.isArray(parsedData.taskArray)
      ? parsedData.taskArray
      : [];
    taskList.taskId = parsedData.taskId || 0;
    taskList.renderTasks();
  }
}
loadTasks();

form.addEventListener("submit", () => {
  const taskName = document.querySelector("#taskinput").value;
  const dateInput = document.querySelector("#dateinput").value;
  const selectedPriority = document.querySelector(
    'input[name="priorityinput"]:checked'
  ).value;

  taskList.addTask(taskName, dateInput, selectedPriority);

  popup.style.display = "none";
  body.style.pointerEvents = "auto";
  body.style.backgroundColor = "white";
  form.reset();
  saveTasks();
});

//Local storage can only store strings but you can express
//your object as strings
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    popup.style.display = "none";
    editorPopUp.style.display = "none";
    body.style.pointerEvents = "auto";
    body.style.backgroundColor = "white";
    form.reset();
  });
});

taskButton.addEventListener("click", () => {
  popup.style.display = "block";
  body.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  body.style.pointerEvents = "none";
  popup.style.pointerEvents = "auto";
});

const sortSelect = document.querySelector("#sortOptions");

//use change since it activate when user select a new option in the dropdown
//and confirm their choice by either releasing the mouse or enter.
sortSelect.addEventListener("change", () => {
  const selectedValue = sortSelect.value;
  if (selectedValue === "priority") {
    taskList.sortTask("priority");
  } else if (selectedValue === "dueDate") {
    taskList.sortTask("dueDate");
  }
});

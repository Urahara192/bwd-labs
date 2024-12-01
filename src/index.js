import './styles/about-style.css';
import './styles/add.css';
import './styles/main-style.css';
import './styles/projects-style.css';
import './styles/tasks-style.css'; // Импорт стилей для страницы задач

document.addEventListener("DOMContentLoaded", function () {
  // Элементы модального окна
  const dialog = document.getElementById("task-dialog");
  const openDialogButton = document.getElementById("open-dialog-btn");
  const closeDialogButton = document.getElementById("close-dialog-btn");
  const submitTaskButton = document.getElementById("submit-task-btn");
  const taskNameInput = document.getElementById("task-name");
  const taskPriorityInput = document.getElementById("task-priority");

  // Элементы сортировки
  const sortTasksButton = document.getElementById("sort-tasks");
  const sortInProgressButton = document.getElementById("sort-in-progress");
  const sortCompletedButton = document.getElementById("sort-completed");

  // Флаги направления сортировки
  let sortOrderTasks = "asc";
  let sortOrderInProgress = "asc";
  let sortOrderCompleted = "asc";

  // Открытие модального окна
  openDialogButton.addEventListener("click", function () {
    dialog.showModal();
  });

  // Закрытие модального окна
  closeDialogButton.addEventListener("click", function () {
    dialog.close();
  });

  // Загрузка задач при загрузке страницы
  loadTasks();

  // Добавление задачи
  submitTaskButton.addEventListener("click", function (event) {
    event.preventDefault();
    const taskName = taskNameInput.value.trim();
    const taskPriority = taskPriorityInput.value;

    if (taskName) {
      addTask(taskName, taskPriority);
      dialog.close();
      taskNameInput.value = "";
      taskPriorityInput.value = "low";
    } else {
      alert("Введите название задачи!");
    }
  });

  // Добавление новой задачи в DOM и сохранение
  function addTask(taskName, taskPriority) {
    const taskItem = createTaskElement(taskName, taskPriority, "tasks-column", false);
    document.getElementById("tasks-column").appendChild(taskItem);
    saveTasks();
  }

  // Создание элемента задачи
  function createTaskElement(taskName, taskPriority, taskStatus, isChecked) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.dataset.priority = taskPriority;

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = isChecked;

    const taskText = document.createElement("span");
    taskText.textContent = taskName;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("button", "delete-btn");
    deleteButton.textContent = "Удалить";

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);

    // Добавление обработчиков
    deleteButton.addEventListener("click", function () {
      taskItem.remove();
      saveTasks();
    });

    taskCheckbox.addEventListener("change", function () {
      if (taskCheckbox.checked) {
        moveToNextColumn(taskItem);
      }
      saveTasks();
    });

    return taskItem;
  }

  // Перемещение задачи в следующий столбец
  function moveToNextColumn(taskItem) {
    const taskColumn = taskItem.parentElement;
    if (taskColumn.id === "tasks-column") {
      document.getElementById("in-progress-column").appendChild(taskItem);
    } else if (taskColumn.id === "in-progress-column") {
      document.getElementById("completed-column").appendChild(taskItem);
    }
  }

  // Сохранение задач в localStorage
  function saveTasks() {
    const tasks = [];
    const taskColumns = document.querySelectorAll(".task-column");

    taskColumns.forEach((column) => {
      const tasksInColumn = column.querySelectorAll(".task-item");
      tasksInColumn.forEach((task) => {
        tasks.push({
          taskName: task.querySelector("span").textContent,
          taskStatus: column.id,
          isChecked: task.querySelector("input").checked,
          taskPriority: task.dataset.priority,
        });
      });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Загрузка задач из localStorage
  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      savedTasks.forEach((task) => {
        const column = document.getElementById(task.taskStatus);
        const taskItem = createTaskElement(task.taskName, task.taskPriority, task.taskStatus, task.isChecked);
        column.appendChild(taskItem);
      });
    }
    sortAllColumns();
  }

  // Сортировка задач в столбце
  function sortColumnByPriority(columnId, sortOrder) {
    const column = document.getElementById(columnId);
    const tasks = Array.from(column.querySelectorAll(".task-item"));

    tasks.sort((a, b) => {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return sortOrder === "asc"
        ? priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority]
        : priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority];
    });

    tasks.forEach((task) => column.appendChild(task));
  }

  // Сортировка всех столбцов
  function sortAllColumns() {
    sortColumnByPriority("tasks-column", sortOrderTasks);
    sortColumnByPriority("in-progress-column", sortOrderInProgress);
    sortColumnByPriority("completed-column", sortOrderCompleted);
  }

  // Сортировка задач в разных столбцах
  sortTasksButton.addEventListener("click", function () {
    sortOrderTasks = sortOrderTasks === "asc" ? "desc" : "asc";
    sortColumnByPriority("tasks-column", sortOrderTasks);
  });

  sortInProgressButton.addEventListener("click", function () {
    sortOrderInProgress = sortOrderInProgress === "asc" ? "desc" : "asc";
    sortColumnByPriority("in-progress-column", sortOrderInProgress);
  });

  sortCompletedButton.addEventListener("click", function () {
    sortOrderCompleted = sortOrderCompleted === "asc" ? "desc" : "asc";
    sortColumnByPriority("completed-column", sortOrderCompleted);
  });
});

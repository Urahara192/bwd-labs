import './styles/about-style.css';
import './styles/add.css';
import './styles/main-style.css';
import './styles/projects-style.css';
import './styles/tasks-style.css'; // Импорт стилей для страницы задач

document.addEventListener("DOMContentLoaded", function () {
  // Модальное окно
  const dialog = document.getElementById("task-dialog");
  const openDialogButton = document.getElementById("open-dialog-btn");
  const closeDialogButton = document.getElementById("close-dialog-btn");
  const submitTaskButton = document.getElementById("submit-task-btn");
  const taskNameInput = document.getElementById("task-name");
  const taskPriorityInput = document.getElementById("task-priority");

  // Кнопки сортировки по приоритету
  const sortTasksButton = document.getElementById("sort-tasks");
  const sortInProgressButton = document.getElementById("sort-in-progress");
  const sortCompletedButton = document.getElementById("sort-completed");

  // Флаги для отслеживания направления сортировки
  let sortOrderTasks = "asc";  // По умолчанию сортировка по возрастанию
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

  // Загрузка задач из localStorage
  loadTasks();

  // Добавление задачи
  submitTaskButton.addEventListener("click", function (event) {
    event.preventDefault();

    const taskName = taskNameInput.value;
    const taskPriority = taskPriorityInput.value; // Получаем выбранный приоритет
    if (taskName.trim() !== "") {
      addTask(taskName, taskPriority);
      dialog.close();
      taskNameInput.value = ""; // Очистить поле ввода
      taskPriorityInput.value = "low"; // Сбросить приоритет в "Низкий"
    }
  });

  // Функция добавления задачи
  function addTask(taskName, taskPriority) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.dataset.priority = taskPriority;  // Устанавливаем приоритет задачи

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";

    const taskText = document.createElement("span");
    taskText.textContent = taskName;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("button", "delete-btn");
    deleteButton.textContent = "Удалить";

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);

    // Добавление задачи в "Задачи"
    document.getElementById("tasks-column").appendChild(taskItem);

    // Обработчик для удаления задачи
    deleteButton.addEventListener("click", function () {
      taskItem.remove();
      saveTasks(); // Сохраняем задачи после удаления
    });

    // Обработчик для чекбокса
    taskCheckbox.addEventListener("change", function () {
      if (taskCheckbox.checked) {
        moveToNextColumn(taskItem);
      }
      saveTasks(); // Сохраняем задачи после изменения состояния чекбокса
    });

    saveTasks(); // Сохраняем задачи при добавлении новой
  }

  // Функция перемещения задачи в следующий столбец
  function moveToNextColumn(taskItem) {
    const taskColumn = taskItem.parentElement;
    if (taskColumn.id === "tasks-column") {
      // Перемещение из "Задачи" в "В процессе"
      document.getElementById("in-progress-column").appendChild(taskItem);
    } else if (taskColumn.id === "in-progress-column") {
      // Перемещение из "В процессе" в "Выполнены"
      document.getElementById("completed-column").appendChild(taskItem);
    }
  }

  // Функция для сохранения задач в localStorage
  function saveTasks() {
    const tasks = [];
    const taskColumns = document.querySelectorAll('.task-column');

    taskColumns.forEach(column => {
      const tasksInColumn = column.querySelectorAll('.task-item');
      tasksInColumn.forEach(task => {
        const taskName = task.querySelector('span').textContent;
        const taskStatus = column.id; // id столбца: "tasks-column", "in-progress-column", "completed-column"
        const isChecked = task.querySelector('input').checked;
        const taskPriority = task.dataset.priority; // Приоритет задачи
        tasks.push({ taskName, taskStatus, isChecked, taskPriority });
      });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Функция для загрузки задач из localStorage
  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      savedTasks.forEach(task => {
        addTaskToColumn(task.taskName, task.taskStatus, task.isChecked, task.taskPriority);
      });
    }

    // Сортировка задач сразу после загрузки
    sortColumnByPriority("tasks-column", sortOrderTasks);
    sortColumnByPriority("in-progress-column", sortOrderInProgress);
    sortColumnByPriority("completed-column", sortOrderCompleted);
  }

  // Функция для добавления задачи в нужный столбец
  function addTaskToColumn(taskName, taskStatus, isChecked, taskPriority) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.dataset.priority = taskPriority;  // Устанавливаем приоритет задачи

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

    // Определяем, в какой столбец добавить задачу
    const column = document.getElementById(`${taskStatus}-column`);
    column.appendChild(taskItem);

    // Обработчик для удаления задачи
    deleteButton.addEventListener("click", function () {
      taskItem.remove();
      saveTasks();
    });

    // Обработчик для чекбокса
    taskCheckbox.addEventListener("change", function () {
      if (taskCheckbox.checked) {
        moveToNextColumn(taskItem);
      }
      saveTasks();
    });
  }

  // Функция сортировки задач по приоритету в столбце
  function sortColumnByPriority(columnId, sortOrder) {
    const column = document.getElementById(columnId);
    const tasks = Array.from(column.querySelectorAll('.task-item'));

    tasks.sort((a, b) => {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      if (sortOrder === "asc") {
        return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
      } else {
        return priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority];
      }
    });

    tasks.forEach(task => column.appendChild(task)); // Перемещаем отсортированные задачи обратно в столбец
  }

  // Сортировка для "Задачи"
  sortTasksButton.addEventListener("click", function () {
    sortOrderTasks = sortOrderTasks === "asc" ? "desc" : "asc";  // Переключаем направление сортировки
    sortColumnByPriority("tasks-column", sortOrderTasks);
  });

  // Сортировка для "В процессе"
  sortInProgressButton.addEventListener("click", function () {
    sortOrderInProgress = sortOrderInProgress === "asc" ? "desc" : "asc"; 
    sortColumnByPriority("in-progress-column", sortOrderInProgress);
  });

  // Сортировка для "Выполнены"
  sortCompletedButton.addEventListener("click", function () {
    sortOrderCompleted = sortOrderCompleted === "asc" ? "desc" : "asc"; 
    sortColumnByPriority("completed-column", sortOrderCompleted);
  });
});

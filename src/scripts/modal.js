document.addEventListener("DOMContentLoaded", function() {
  const openDialogButton = document.getElementById("open-dialog-btn");
  const dialog = document.getElementById("task-dialog");
  const closeDialogButton = document.getElementById("close-dialog-btn");

  // Открытие модального окна при нажатии на кнопку "Добавить"
  openDialogButton.addEventListener("click", function() {
      dialog.showModal();
  });

  // Закрытие модального окна при нажатии на кнопку "Отмена"
  closeDialogButton.addEventListener("click", function() {
      dialog.close();
  });

  // Закрытие модального окна при нажатии за его пределами
  dialog.addEventListener("click", function(event) {
      const dialogBounds = dialog.getBoundingClientRect();
      if (
          event.clientX < dialogBounds.left ||
          event.clientX > dialogBounds.right ||
          event.clientY < dialogBounds.top ||
          event.clientY > dialogBounds.bottom
      ) {
          dialog.close();
      }
  });
});

// document.getElementById('submit-task-btn').addEventListener('click', () => {
//     const inputField = document.querySelector('.enter');
//     inputField.value = ''; // Очищает поле ввода
// });

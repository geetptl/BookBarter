const modal = document.querySelector("#modal");
const openModal = document.querySelector(".open-button");
const closeModal = document.querySelector(".close-button");

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log("Form submitted");
  document.getElementById('modal').close();
});

document.addEventListener('DOMContentLoaded', (event) => {
  const closeButton = document.querySelector('.close-button');
  if (closeButton) {
      closeButton.addEventListener('click', () => {
          document.getElementById('modal').close();
      });
  } else {
      console.error('The close button was not found.');
  }

  const form = document.querySelector('.form');
  if (form) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          // Handle the form submission here
          document.getElementById('modal').close();
      });
  } else {
      console.error('The form was not found.');
  }
});
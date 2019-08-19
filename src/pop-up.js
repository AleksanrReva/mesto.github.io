import {buttonUserInfo, buttonEditUser, popupForm, popupImage, formNew, formEdit} from './variables.js';

export class Popup {
    open() {
      if (event.target === buttonUserInfo) {
        popupForm.classList.toggle('hidden');
        formNew.classList.remove('hidden');
        formEdit.classList.add('hidden');
        popupImage.classList.add('hidden');
        document.querySelector('.popup__title').textContent = 'Новое место';
      }
      if (event.target === buttonEditUser) {
        popupForm.classList.toggle('hidden');
        formNew.classList.add('hidden');
        formEdit.classList.remove('hidden');
        popupImage.classList.add('hidden');
        document.querySelector('.popup__title').textContent = 'Редактировать профиль';
        formEdit.elements.name.placeholder = document.querySelector('.user-info__name').textContent;
        formEdit.elements.about.placeholder = document.querySelector('.user-info__job').textContent;
      }
      if (event.target.classList.value === 'place-card__image') {
        popupForm.classList.toggle('hidden');
        formNew.classList.add('hidden');
        formEdit.classList.add('hidden');
        popupImage.classList.remove('hidden');
        const urlImage = event.target.style.backgroundImage
        document.querySelector('.popup__image').src = urlImage.substring(5, urlImage.length - 2);
      }
    }
  
    close() {
      if (event.target.classList.value === 'popup__close') {
        popupForm.classList.toggle('hidden');
      }
    }
  };
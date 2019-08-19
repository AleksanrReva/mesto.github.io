import {
  placesList, 
  buttonUserInfo, 
  buttonEditUser, 
  popupForm, 
  buttonClosePopup, 
  formNew, 
  formEdit, 
  checkExtension,
  checkStatus,
  json
} from './variables.js';
import {Popup} from './pop-up.js';
import {ForFetch} from './for-fetch.js';
import {CardListMake} from './card-list-make.js';

let cardList;
const popup = new Popup();
const cardsAPI = new ForFetch();

/* Запрос данных автора */
cardsAPI.authorCheck()
  .then(checkStatus)
  .then(json)
  .then((data) => {
    document.querySelector('.user-info__name').textContent = data.name;
    document.querySelector('.user-info__job').textContent = data.about;
    document.querySelector('.user-info__photo').style = `background-image: url(${data.avatar})`;
})
.catch(error => console.error(error));

/* Запрос и создание карточек по умолчанию */
cardsAPI.cardsBaseSet()
  .then(checkStatus)
  .then(json)
  .then((data) => {
    cardList = new CardListMake(placesList, data);
  })
.catch(error => console.error(error));

/* Редактировать профиль */
function editUserProfile (event) {
  event.target.submit.textContent = 'Загрузка...';
  
  cardsAPI.userEdit(formEdit.elements.name.value, formEdit.elements.about.value)
    .catch(error => console.error(error))
    .finally(() => {
      document.querySelector('.user-info__name').textContent = formEdit.elements.name.value;
      document.querySelector('.user-info__job').textContent = formEdit.elements.about.value;
      popupForm.classList.toggle('hidden');
      event.target.submit.textContent = 'Сохранить';
    });
  event.preventDefault();
}

/* Валидация */
function setErrMessage (element) {
  const errElement = document.querySelector(`#err-${element.name}`);
  const strWithoutSpaces = element.value.replace(/\s+/g, ' ').trim();
  
  if (event.target.name === 'link'
      && !(checkExtension.some((ext) => formNew.elements.link.value.endsWith(ext)))) {
    errElement.textContent = 'Адрес не содержит расширения картинки';
    errElement.classList.remove('popup__error-msg_hidden');
  }

  if (!element.checkValidity()) {
    if (element.name === 'link') {
      errElement.textContent = 'Здесь должна быть ссылка';
      errElement.classList.remove('popup__error-msg_hidden');
    } else if (strWithoutSpaces.length === 0) {
      errElement.textContent = 'Это обязательное поле';
      errElement.classList.remove('popup__error-msg_hidden');
    } else if (strWithoutSpaces.length < 2 || strWithoutSpaces.length > 30) {
      errElement.textContent = 'Должно быть от 2 до 30 символов';
      errElement.classList.remove('popup__error-msg_hidden');
    }
  }
}

function resetErrMessage (element) {
  const errElement = document.querySelector(`#err-${element.name}`);
  errElement.classList.add('popup__error-msg_hidden');
}

function inputValidate (event) {
  resetErrMessage(event.target);
  setErrMessage(event.target);

  const inputsForm = Array.from(event.target.parentElement.getElementsByClassName('forChecking'));
  const emptyValue = inputsForm.some((input) => input.value.replace(/\s+/g, ' ').trim().length < 2);
  const tooMuchValue = inputsForm.some((input) => input.value.replace(/\s+/g, ' ').trim().length > 30);

  if (event.target.name === 'link') {
    if (!formNew.elements.link.validity.valid
        || !(checkExtension.some((ext) => formNew.elements.link.value.endsWith(ext)))) {
      event.target.parentElement.elements.submit.setAttribute('disabled', true);
      event.target.parentElement.elements.submit.classList.remove('popup__button_enabled');
    } else if (!formNew.elements.title.validity.valueMissing) {
      event.target.parentElement.elements.submit.removeAttribute('disabled')
      event.target.parentElement.elements.submit.classList.add('popup__button_enabled');
    }
  } else {
    if (emptyValue || tooMuchValue) {
      event.target.parentElement.elements.submit.setAttribute('disabled', true);
      event.target.parentElement.elements.submit.classList.remove('popup__button_enabled');
    } else if (!(Array.from(event
        .target
        .parentElement
        .querySelectorAll('input'))
        .some((input) => input.value === ''))) {
      event.target.parentElement.elements.submit.removeAttribute('disabled')
      event.target.parentElement.elements.submit.classList.add('popup__button_enabled');
    }
  }
}

/* Слушатели событий */
buttonUserInfo.addEventListener('click', popup.open);
buttonEditUser.addEventListener('click', popup.open);
buttonClosePopup.addEventListener('click', popup.close);

formNew.addEventListener('submit', function(event) {
  cardList.addCard(event);
});
formEdit.addEventListener('submit', function(event) {
  editUserProfile(event);
});
formNew.addEventListener('input', inputValidate);
formEdit.addEventListener('input', inputValidate);
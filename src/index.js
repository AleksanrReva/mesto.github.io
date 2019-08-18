/* Объявление классов */
class Popup {
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

class Card extends Popup {
  constructor(title, link, idCard, likeCard, likeWho) {
    super();
    this.cardSingle = this.create(title, link, idCard, likeCard, likeWho);
    
    this.cardSingle.querySelector('.place-card__like-icon').addEventListener('click', this.like.bind(this));
    this.cardSingle.querySelector('.place-card__delete-icon').addEventListener('click', this.remove.bind(this));
    this.cardSingle.querySelector('.place-card__image').addEventListener('click', this.open.bind(this));
  }

  like(event) {
    if (event.target.classList.contains('place-card__like-icon_liked')) {
      event.target.classList.toggle('place-card__like-icon_liked');
      fetch(`http://${ipValue}/${cohortId}/cards/like/${event.target.parentElement.parentElement.parentElement.id}`, {
        method: 'DELETE',
        headers: {
          authorization: token
        }
      })
      .then(checkStatus)
      .then(json)
      .then((data) => {
        console.log(data['likes'].length);
        event.target.parentElement.querySelector('.place-card__like-counter').textContent = parseInt(data['likes'].length);
      })
      .catch(error => console.error(error));
    } else {
      event.target.classList.toggle('place-card__like-icon_liked');
      fetch(`http://${ipValue}/${cohortId}/cards/like/${event.target.parentElement.parentElement.parentElement.id}`, {
        method: 'PUT',
        headers: {
          authorization: token
        }
      })
      .then(checkStatus)
      .then(json)
      .then((data) => {
        console.log(data['likes'].length);
        event.target.parentElement.querySelector('.place-card__like-counter').textContent = parseInt(data['likes'].length);
      })
      .catch(error => console.error(error));
    }
  }

  remove(event) {
    if (confirm(`Вы действительно хотите удалить карточку «${event.target.parentElement.parentElement.querySelector('.place-card__name').textContent}»?`)) {
      placesList.removeChild(event.target.parentElement.parentElement);
      fetch(`http://${ipValue}/${cohortId}/cards/${event.target.parentElement.parentElement.id}`, {
        method: 'DELETE',
        headers: {
          authorization: token,
          'Content-Type': 'application/json'
        }
      })
      .catch(error => console.error(error));
    }
  }
  
  create(titleValue, linkValue, idCard, likeCard, likeWho) {
    const divPlaceCard = document.createElement('div');
    const divPlaceCardImage = document.createElement('div');
    const buttonPlaceCardDelete = document.createElement('button');
    const divPlaceCardDescript = document.createElement('div');
    const headlinePlaceCardName = document.createElement('h3');
    const divLikeGroup = document.createElement('div');
    const buttonPlaceCardLike = document.createElement('button');
    const valueLikeCounter =  document.createElement('p');
    
    divPlaceCard.classList.add('place-card');
    divPlaceCard.id = idCard;
    divPlaceCardImage.classList.add('place-card__image');
    buttonPlaceCardDelete.classList.add('place-card__delete-icon');
    divPlaceCardDescript.classList.add('place-card__description');
    headlinePlaceCardName.classList.add('place-card__name');
    divLikeGroup.classList.add('place-card__like-group');
    buttonPlaceCardLike.classList.add('place-card__like-icon');
    valueLikeCounter.classList.add('place-card__like-counter');
    
    if (linkValue.includes('blackMark')) {
      buttonPlaceCardDelete.classList.add('place-card__delete-icon_display');
    }

    placesList.appendChild(divPlaceCard);
    divPlaceCard.appendChild(divPlaceCardImage);
    divPlaceCardImage.style.backgroundImage = `url(${linkValue})`;
    divPlaceCardImage.appendChild(buttonPlaceCardDelete);
    divPlaceCard.appendChild(divPlaceCardDescript);
    divPlaceCardDescript.appendChild(headlinePlaceCardName);
    headlinePlaceCardName.textContent = titleValue;
    divPlaceCardDescript.appendChild(divLikeGroup);
    divLikeGroup.appendChild(buttonPlaceCardLike);
    divLikeGroup.appendChild(valueLikeCounter);
    if (likeCard) {
      valueLikeCounter.textContent = likeCard;
      likeWho.forEach(function (whoObj) {
        const { name } = whoObj;
        if (name === document.querySelector('.user-info__name').textContent) {
          buttonPlaceCardLike.classList.toggle('place-card__like-icon_liked');
        }
      });
    } else {
      valueLikeCounter.textContent = '0';
    }

    return divPlaceCard;
  }
};

class CardListClass {
  constructor(placesList, initialCards) {
    this.initialCards = initialCards;
    this.placesList = placesList;
    this.cardList = this.render();
  }

  addCard(event) {
    event.target.submit.classList.add('popup__button_text');
    event.target.submit.textContent = 'Загрузка...';

    const linkValuePlusMark = `${formNew.elements.link.value}?blackMark`;
    fetch(`http://${ipValue}/${cohortId}/cards`, {
      method: 'POST',
      headers: {
          authorization: token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: formNew.elements.title.value,
          link: linkValuePlusMark
      })
    })
      .then(checkStatus)
      .then(json)
      .then((data) => {
        new Card(formNew.elements.title.value, formNew.elements.link.value);

        this.placesList.lastChild.firstChild.firstChild.classList.add('place-card__delete-icon_display');
        this.placesList.lastChild.id = data['_id'];

        popupForm.classList.toggle('hidden');
        event.target.submit.classList.remove('popup__button_text');
        event.target.submit.textContent = '+';
        
        formNew.reset();
        formNew.elements.submit.setAttribute('disabled', true);
        formNew.elements.submit.classList.remove('popup__button_enabled');
      })
    .catch(error => console.error(error));

    event.preventDefault();
  }

  render() {
    this.initialCards.forEach (function (cardData) {
      new Card(cardData.name, cardData.link, cardData['_id'], cardData['likes'].length, cardData['likes']);
    });
  }
};

/* Переменные */
const placesList = document.querySelector('.places-list');
const buttonUserInfo = document.querySelector('.user-info__button');
const buttonEditUser = document.querySelector('.user-info__edit-button');
const popupForm = document.querySelector('.popup');
const popupImage = document.querySelector('.popup__content-image');
const buttonClosePopup = document.querySelector('.root');
const formNew = document.forms.new;
const formEdit = document.forms.edit;
const checkExtension = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

let cardList;
const popup = new Popup();

/* Для запросов */
const token = '9173a34e-3af8-41e0-be47-eccb98e5e3db';
const cohortId = 'cohort0';
const ipValue = '95.216.175.5'

function checkStatus(response) {  
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  if (response.ok) {
    return response.json();
  }
}

/* Запрос данных автора */
fetch(`http://${ipValue}/${cohortId}/users/me`, {
  headers: {
    authorization: token
  }
})
  .then(checkStatus)
  .then(json)
  .then((data) => {
    document.querySelector('.user-info__name').textContent = data.name;
    document.querySelector('.user-info__job').textContent = data.about;
    document.querySelector('.user-info__photo').style = `background-image: url(${data.avatar})`;
})
.catch(error => console.error(error));

/* Запрос и создание карточек по умолчанию */
fetch(`http://${ipValue}/${cohortId}/cards`, {
    headers: {
      authorization: token
    }
  })
  .then(checkStatus)
  .then(json)
  .then((data) => {
    cardList = new CardListClass(placesList, data);
  })
.catch(error => console.error(error));

/* Редактировать профиль */
function editUserProfile (event) {
  event.target.submit.textContent = 'Загрузка...';
  fetch(`http://${ipValue}/${cohortId}/users/me`, {
    method: 'PATCH',
    headers: {
        authorization: token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: formEdit.elements.name.value,
        about: formEdit.elements.about.value
    })
  })
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
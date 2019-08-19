import {Popup} from './pop-up.js';
import {ForFetch} from './for-fetch.js';
import {placesList, checkStatus, json} from './variables.js';

export class Card extends Popup {
    constructor(title, link, idCard, likeCard, likeWho) {
      super();
      this.cardSingle = this.create(title, link, idCard, likeCard, likeWho);
      this.cardAction = new ForFetch();
      
      this.cardSingle.querySelector('.place-card__like-icon').addEventListener('click', this.like.bind(this));
      this.cardSingle.querySelector('.place-card__delete-icon').addEventListener('click', this.remove.bind(this));
      this.cardSingle.querySelector('.place-card__image').addEventListener('click', this.open.bind(this));
    }
  
    like(event) {
      if (event.target.classList.contains('place-card__like-icon_liked')) {
        event.target.classList.toggle('place-card__like-icon_liked');
        
        this.cardAction.likeDelete(event)
        .then(checkStatus)
        .then(json)
        .then((data) => {
          console.log(data['likes'].length);
          event.target.parentElement.querySelector('.place-card__like-counter').textContent = parseInt(data['likes'].length);
        })
        .catch(error => console.error(error));
      } else {
        event.target.classList.toggle('place-card__like-icon_liked');
  
        this.cardAction.likePut(event)
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
        this.cardAction.removeCard(event).catch(error => console.error(error));
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
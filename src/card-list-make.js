import {Card} from './card.js';
import {ForFetch} from './for-fetch.js';
import {popupForm, formNew, checkStatus, json} from './variables.js';

export class CardListMake {
  constructor(placesList, initialCards) {
    this.initialCards = initialCards;
    this.placesList = placesList;
    this.cardList = this.render();
  }

  addCard(event) {
    event.target.submit.classList.add('popup__button_text');
    event.target.submit.textContent = 'Загрузка...';
    const fetchClass = new ForFetch();

    fetchClass.addCard(formNew.elements.title.value, `${formNew.elements.link.value}?blackMark`)
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
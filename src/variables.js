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

export {
    placesList, 
    buttonUserInfo, 
    buttonEditUser, 
    popupForm, 
    popupImage, 
    buttonClosePopup, 
    formNew, 
    formEdit, 
    checkExtension,
    checkStatus,
    json
};


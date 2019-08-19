export class ForFetch {
  constructor() {
    this.token = '9173a34e-3af8-41e0-be47-eccb98e5e3db';
    this.cohortId = 'cohort0';
    this.ipValue = 'https://praktikum.tk';
  }

  likeDelete(event) {
    return fetch(`${this.ipValue}/${this.cohortId}/cards/like/${event.target.parentElement.parentElement.parentElement.id}`, {
      method: 'DELETE',
      headers: {
        authorization: this.token
      }
    })
  }

  likePut(event) {
    return fetch(`${this.ipValue}/${this.cohortId}/cards/like/${event.target.parentElement.parentElement.parentElement.id}`, {
      method: 'PUT',
      headers: {
        authorization: this.token
      }
    })
  }

  addCard(name, link) {
    return fetch(`${this.ipValue}/${this.cohortId}/cards`, {
      method: 'POST',
      headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: name,
          link: link
      })
    })
  }

  removeCard(event) {
    return fetch(`${this.ipValue}/${this.cohortId}/cards/${event.target.parentElement.parentElement.id}`, {
      method: 'DELETE',
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      }
    })
  }

  authorCheck() {
    return fetch(`${this.ipValue}/${this.cohortId}/users/me`, {
      headers: {
        authorization: this.token
      }
    })
  }

  cardsBaseSet() {
    return fetch(`${this.ipValue}/${this.cohortId}/cards`, {
      headers: {
        authorization: this.token
      }
    })
  }

  userEdit(name, about) {
    return fetch(`${this.ipValue}/${this.cohortId}/users/me`, {
      method: 'PATCH',
      headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: name,
          about: about
      })
    })
  }
};
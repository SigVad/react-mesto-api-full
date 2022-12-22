//В классе описаны запросы к серверу

class Api {
  constructor({ baseUrl, headers, credentials}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._credentials = credentials;
  }
  
  _checkAnswer = (res) => {//проверить ответ
    if (res.ok) {
      return res.json();
    }
    console.log(`Ошибка ${res.status}`);
    return Promise.reject(`Ошибка ${res.status}`);
  }

  getInitialCards() {//запроcить список карт
    console.log(`getInitialCards (запроcить список карт)`);
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._checkAnswer);
  }

  getUserInfo() {//запроcить инф. пользователя
    console.log(`getUserInfo (запроcить инф. пользователя)`);
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      credentials: this._credentials,
    })
    .then(this._checkAnswer);
  }

  changeAvatar(link) {//изменить аватар
    console.log(`changeAvatar (изменить аватар)`);
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        avatar: link,
      }),
    })
      .then(this._checkAnswer);
  }

  changeUserInfo(user) {//изменить информацию пользователя
    console.log(`changeUserInfo (изменить инф. пользователя)`);
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",//частичное обновление ресурса
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        name: user.name,
        about: user.about
      }),
    })
      .then(this._checkAnswer);
  }

  addCard(value) {//отправить новую карту
    console.log(`addCard (отправить новую карту)`);
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify(value),
    })
      .then(this._checkAnswer);
  }

  likeCard(cardId) {//отправить лайк
    console.log(`likeCard (отправить лайк)`);
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",//заменить ресурс полностью
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._checkAnswer);
  }

  dislikeCard(cardId) {//удаление лайка
    console.log(`dislikeCard (удаление лайка)`);
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._checkAnswer);
  }
  
  deleteCard(cardId) {//удаление карты, исп в обработчике сабмита подтверждения
    console.log(`deleteCard (удаление карты)`);
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._checkAnswer);
  }
}

//создадим api и передадим ему юрл сервера и код авторизации
export const api = new Api({
  baseUrl: "https://api.sigvad.students.nomoredomains.club",
  //baseUrl: "http://127.0.0.1:3000",
  headers: {
    //authorization: "f6d44b42-c81d-4168-83e7-55a4e60ba01f",
    "Content-Type": "application/json",
  },
  credentials:'include',
});
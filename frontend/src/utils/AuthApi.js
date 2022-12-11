class AuthApi {
  constructor({ baseUrl, headers, credentials }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
		this._credentials = credentials;
  }

  _checkAnswer(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }

  registration(data) {//запроc регистрации
    console.log(`registration (запроc регистрации)`);
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: this._headers,
			credentials: this._credentials,
      body: JSON.stringify(data)
    })
    .then(this._checkAnswer)
  }

  authorization(data) {//запроc авторизации
    console.log(`authorization (запроc авторизации)`);
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: this._headers,
			credentials: this._credentials,
      body: JSON.stringify(data)
    })
    .then(this._checkAnswer)
  }


  validationCookie() {//запроc для проверки валидности кука и получения email
    console.log(`validationCookie (запроc проверки кука)`);
    return fetch(`${this._baseUrl}/users/me`, {
			method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
			credentials: this._credentials,
    })
    .then(this._checkAnswer)
  }

  logOut() { //логи
    return fetch(`${this._baseURL}/logout`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: this._credentials,
    })
      .then(this._checkResponseStatus)
  }

}

export const authApi = new AuthApi({
  baseUrl: 'https://api.sigvad.students.nomoredomains.club',
  headers: {
    'Content-Type': 'application/json'
  },
	credentials: 'include',
});
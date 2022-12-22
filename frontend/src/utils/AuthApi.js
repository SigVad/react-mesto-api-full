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


  getContent() {//запроc для получения email
    console.log(`getContent (запроc для получения email)`);
    return fetch(`${this._baseUrl}/users/me`, {
			method: 'GET',
      headers: this._headers,
			credentials: this._credentials,
    })
    .then(this._checkAnswer)
  }

  logOut() { //выйти
    return fetch(`${this._baseURL}/logout`, {
      method: 'POST',
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._checkResponseStatus)
  }

}

export const authApi = new AuthApi({
  //baseUrl: "http://127.0.0.1:3000",
  baseUrl: 'https://api.sigvad.students.nomoredomains.club',
  headers: {
    "Content-Type": "application/json",
  },
	credentials: 'include',
});
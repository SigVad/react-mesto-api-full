import { withRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import Header from "./Header";
import {useForm} from '../hooks/useForm';

function Login(props) {
  const authData =  useForm({email:'', pass:''});

  function handleSubmit(event) {
    event.preventDefault();
    props.onLogin({
      email: authData.values.email,
      password: authData.values.pass,
    })
    authData.setValues({email:'', pass:''});
  }

  return (  
    <>
      <Header 
        buttonName='Регистрация'
        headerLink='/sign-up'
      />
      <main className="content">
      <AuthForm
        name='login'
        title='Вход'
        buttonName='Войти'
        onSubmit={handleSubmit}
      >
        <label htmlFor="input-email" className="popup__label auth__label">
          <input 
            type="text" 
            id="input-email" 
            className="auth__input" 
            placeholder="Email" 
            required 
            minLength="2" 
            maxLength="30" 
            name="email" 
            onChange={authData.handleChange}
            value={authData.values.email}
          />
          <span className="popup__error"></span>
        </label>
        <label htmlFor="input-pass" className="popup__label auth__label">
          <input 
            type="password"
            id="input-pass"
            className="auth__input"
            placeholder="Пароль"
            required
            name="pass"
            onChange={authData.handleChange}
            value={authData.values.pass}
            autoComplete="off"
          />
          <span className="popup__error"></span>
        </label>
      </AuthForm>
      </main>
    </>
  )
}

export default withRouter(Login);
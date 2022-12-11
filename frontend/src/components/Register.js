import { Link, withRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import Header from "./Header";
import {useForm} from '../hooks/useForm';

function Register(props) {
  const authData =  useForm({email:'', pass:''});

  function handleSubmit(event) {
    event.preventDefault();
    props.onRegister({
      password: authData.values.pass,
      email: authData.values.email,
    });
    if (props.auth) {
      props.onSuccess();
    }
  }

  return (
    <>
      <Header 
        buttonName='Войти'
        headerLink='/sign-in'
      />
      <main className="content">
      <AuthForm
        name='login'
        title='Регистрация'
        buttonName='Зарегистрироваться'
        headerLinkName='Войти'
        headerLinkUrl='/sign-in'
        onSubmit={handleSubmit}
      >
        <label htmlFor="input-email" className="popup__label auth__label">
          <input 
            type="email" 
            id="input-email" 
            className="popup__input auth__input" 
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
            className="popup__input auth__input"
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
        <p className='auth__note'>Уже зарегистрированы?&nbsp;
          <Link to='/sign-in' className='auth__link'>Войти</Link>
        </p>
      </main>
    </>
  )
}

export default withRouter(Register);

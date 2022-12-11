import { Link } from 'react-router-dom';
import logo from '../images/header/logo.svg';

function Header({headerLink, buttonName, onClick, children}) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип сайта" />
      <div className="header__info">
        <p className='header__email'>{children}</p>
        <Link className='header__link' 
          to={headerLink}
          onClick={onClick}
        >{buttonName}</Link>
      </div>
    </header>
  );
}

export default Header;
import { useState, useEffect } from 'react';
import '../index.css';
import Main from './Main';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
//import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';
import { authApi } from "../utils/AuthApi";
import { Route, Switch, withRouter } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from './InfoTooltip';

function App(props) {
  
  const textAuthStatusSuccess = 'Вы успешно \nзарегистрировались!';
  const textAuthStatusErrorDefault = `Что-то пошло не так! \nПопробуйте ещё раз.`;
  let textError = '';

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  
  //email для хедера
  const [pageData, setPageData] = useState({});
  //статус авторизации
  const [loggedIn, setLoggedIn] = useState(false);
  //текст попапа статуса 
  const [isInfoStatusText, setIsInfoStatusText] = useState('');
  //открыть попап статуса
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  //значение попапа статуса
  const [popupSuccess, setPopupSuccess] = useState(false);

  useEffect(() => {
    api.getUserInfo()
      .then(() => {
        props.history.push('/');
        setLoggedIn(true);
      })
      .catch(() => {
        props.history.push('/sign-in');
        setLoggedIn(false);
      });
  }, [props.history]);
  
  useEffect(() => {
    if (loggedIn) 
    {
      api.getUserInfo()
      .then((res) => {
        props.history.push('/');
        setLoggedIn(true);
        setCurrentUser(res)
      })
      .catch(err => {
        const textError = `Не удалось получить данные пользователя.`;
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
      });

      api.getInitialCards()
        .then((res) => {
          setCards(res);
        })
        .catch(err => {
          const textError = `Не удалось получить карточки.`;
          console.log(`${textError} Ошибка ${err}`);
          handleInfoTooltipOpen(false, textError);
        });
    }
  },[loggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }
  
  function handleEditProfileClick(props) {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleUpdateAvatar(link) {
    api.changeAvatar(link)
      .then(newUserData => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch(err => {
        textError = `Не удалось обновить аватар.`;
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
      });
  }

  function handleUpdateUser(userData) {
    api.changeUserInfo(userData)
      .then(newUserData => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch(err => {
        textError = `Не удалось обновить данные пользователя.`;
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
      });
  }

  function handleAddPlaceSubmit (preloadCard) {
    api.addCard(preloadCard)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        textError = `Не удалось добавить карточку.`;
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
      });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    // проверяем, есть ли лайк на этой карточке
    const isLiked = card.likes.some((item) => {
      return item === currentUser._id;
    })
    if (isLiked) {
      api.dislikeCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err => {
          textError = `Не удалось удалить лайк.`;
          console.log(`${textError} Ошибка ${err}`);
          handleInfoTooltipOpen(false, textError);
        });
    } else {
      api.likeCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err => {
          textError = `Не удалось поставить лайк.`;
          console.log(`${textError} Ошибка ${err}`);
          handleInfoTooltipOpen(false, textError);
        });
    }
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        setIsCardDeletePopupOpen(false);
      })
      .catch(err => {
        textError = `Не удалось удалить карточку.`;
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
      });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setIsCardDeletePopupOpen(false);
  }

  function handleRegister(data) {
    authApi.registration(data)
    .then((res) => {
      handleInfoTooltipOpen(true, textAuthStatusSuccess);
      return res;
    })
    .catch((err) => {
      switch (err) {
        case 400:
          textError = `Некорректно заполнено одно из полей ввода.`;
          break;
        default:
          textError = textAuthStatusErrorDefault;
        };
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
    })
  }

  function handleLogin(data) {
    authApi.authorization(data)
    .then((res) => {
        setLoggedIn(true);
        setPageData({
          'email': data.email,
        });
        props.history.push('/');
    })
    .catch((err) => {
      switch (err) {
        case 400:
          textError = `Не передано одно из полей ввода.`;
          break;
        case 401:
          textError = `Пользователь с этим Email не найден.`;
          break;
        default:
          textError = textAuthStatusErrorDefault;
        };
        console.log(`${textError} Ошибка ${err}`);
        handleInfoTooltipOpen(false, textError);
    })
  }

  function signout() {
    authApi.signOut()
      .then(() => {
        props.history.push('/sign-in');
        //setLoggedIn(false);
        //setPageData(null);
    })
    .catch((err) => console.log(err));
  }

  function handleInfoTooltipOpen(result, text) {
    closeAllPopups();
    setPopupSuccess(result);
    setIsInfoStatusText(text);
    setIsInfoTooltipOpen(true);
  }

  function closeInfoTooltip() {
    setIsInfoTooltipOpen(false);
    props.history.push('/');
  }
  return (
    <CurrentUserContext.Provider value ={currentUser}>
      <Switch>
        <ProtectedRoute exact path="/"
          loggedIn={loggedIn}
          component={Main}
          //для Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          handleCardLike={handleCardLike}
          handleCardDelete={handleCardDelete}
          //
          headerLinkName='Выйти'
          headerLinkUrl='/sign-in'
          onClick={signout}
          email={pageData.email}
        />
        <Route path="/sign-in">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/sign-up">
          <Register onRegister={handleRegister} />
        </Route>
      </Switch>
      <InfoTooltip 
        isOpen={isInfoTooltipOpen}
        onClose={closeInfoTooltip}
        statusDescription={isInfoStatusText}
        answer={popupSuccess}
      />
      <EditAvatarPopup
        onClose = {closeAllPopups} 
        isOpen = {isEditAvatarPopupOpen}
        changeAvatar={handleUpdateAvatar}
      />
      <EditProfilePopup 
        onClose={closeAllPopups} 
        isOpen={isEditProfilePopupOpen}
        onUpdateUser={handleUpdateUser}
      /> 
      <AddPlacePopup
        onClose = {closeAllPopups} 
        isOpen = {isAddPlacePopupOpen}
        changeAddCard={handleAddPlaceSubmit}
      />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
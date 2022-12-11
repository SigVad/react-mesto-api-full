import { useState, useEffect } from 'react';
import '../index.css';
import Main from './Main';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
//import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';
import { authApi } from "../utils/AuthApi";
import { Route, Switch, withRouter, useHistory  } from 'react-router-dom';
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
	const history = useHistory();
  
  const [pageData, setPageData] = useState({}); //email для хедера
  const [loggedIn, setLoggedIn] = useState(false); //статус авторизации 
  const [isInfoStatusText, setIsInfoStatusText] = useState(''); //текст попапа статуса
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false); //открыть попап статуса
  const [popupSuccess, setPopupSuccess] = useState(false); //значение попапа статуса

  // useEffect(() => {
  //   checkToken();
  // }, []);

	useEffect(() => {
		authApi.validationCookie()
			.then((data) => {
				setLoggedIn(true);
				setPageData({
					'email': data.email,
				});
				history.push('/');
			})
			.catch((err) => {
				history.push("/sign-in");
				console.log(err);
			});
	}, [history])

	useEffect(() => {
		// setLoading(true);
		Promise.all([authApi.getUser(), authApi.getCards()])
			.then((res) => {
				setCurrentUser(res);
				setCards(res);
			})
			.catch((err) => { console.log(err) })
		// .finally(() => setLoading(false))

	}, [loggedIn, history]);

  // useEffect(() => {
  //   if (loggedIn) 
  //   {
  //     api.getUserInfo()
  //     .then((res) => {
  //       setCurrentUser(res)
  //     })
  //     .catch(err => {
  //       textError = `Не удалось получить данные пользователя.`;
  //       console.log(`${textError} Ошибка ${err}`);
  //       handleInfoTooltipOpen(false, textError);
  //     });

  //     api.getInitialCards()
  //       .then((res) => {
  //         setCards(res);
  //       })
  //       .catch(err => {
  //         textError = `Не удалось получить карточки.`;
  //         console.log(`${textError} Ошибка ${err}`);
  //         handleInfoTooltipOpen(false, textError);
  //       });
  //   }
  // },[loggedIn]);

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
    const isLiked = card.likes.some((item) => {
      return item._id === currentUser._id;
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

  //новое

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
      if (res.token) {
        localStorage.setItem('token', res.token);
        setLoggedIn(true);
        setPageData({
          'email': data.email,
        });
        setLoggedIn(true)
        props.history.push('/');
      } else {
        return;
      }
    })
    .catch((err) => {
      handleInfoTooltipOpen(true, textAuthStatusSuccess);
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

  // function checkToken() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     authApi.validationCookie()
  //     .then((data) => {
  //       if (data) {
  //         const userData = {
  //           'emai': data.data.email,
  //         }
  //         setPageData(userData);
  //         setLoggedIn(true)
  //         props.history.push('/')
  //       }
  //     })
  //     .catch((err) => {
  //       switch (err) {
  //         case 400:
  //           textError = `Токен не передан или передан не в том формате.`;
  //           break;
  //         case 401:
  //           textError = `Переданный токен некорректен.`;
  //           break;
  //         default:
  //           textError = textAuthStatusErrorDefault;
  //       };
  //       console.log(`${textError} Ошибка ${err}`);
  //       handleInfoTooltipOpen(false, textError);
  //     })
  //   }
  // }

  function logout() {
    localStorage.setItem('token', '');
    setLoggedIn(false);
  }

  function handleInfoTooltipOpen(result, text) {
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
          onClick={logout}
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
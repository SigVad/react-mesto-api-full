import {useContext, useEffect} from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {useForm} from '../hooks/useForm';

function EditProfilePopup ({ onClose, isOpen, onUpdateUser }){
  //подписка на контекст
  const currentUser = useContext(CurrentUserContext);
  const profileNew =  useForm({name:'', about:''});

  //добавить данные пользователя в инпуты формы при открытии
  useEffect(() => {
    profileNew.setValues(
      {
        name: currentUser.name,
        about: currentUser.about
      })
  }, [currentUser, isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name: profileNew.values.name,
      about: profileNew.values.about
    });
  }

  return (
    <PopupWithForm
      onClose = {onClose}
      isOpen = {isOpen}
      name = "edit"
      title = "Редактировать профиль"
      saveButton = "Сохранить"
      onSubmit = {handleSubmit}
      // isLoading = {isLoading}
    >
      <label className="popup__label">
        <input
          type="text"
          className="popup__input popup__input_name"
          id="input-profile-name"
          placeholder="Имя:"
          name="name"
          required
          minLength="2"
          maxLength="40"
          value={profileNew.values.name ?? ''}
          onChange={profileNew.handleChange}
        />
        <span className="popup__error" id="input-profile-name-error"></span>
      </label>
      <label className="popup__label">
        <input
          type="text"
          className="popup__input popup__input_profession"
          id="input-profile-profession"
          placeholder="О себе:"
          name="about"
          required
          minLength="2"
          maxLength="80"
          value={profileNew.values.about ?? ''}
          onChange={profileNew.handleChange}
        />
        <span className="popup__error" id="input-profile-profession-error"></span>
      </label>
    </PopupWithForm>
  );
}
  
  export default EditProfilePopup;
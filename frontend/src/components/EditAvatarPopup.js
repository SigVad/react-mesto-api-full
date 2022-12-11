import {useEffect, useRef} from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup ({ isOpen, onClose, changeAvatar }) {
    const avatarRef = useRef();
    
    //очистить инпут при открытии
    useEffect(()=>{
      avatarRef.current.value = '';
    },[isOpen]);

    function handleSubmit(evt) {
        evt.preventDefault();
        changeAvatar(avatarRef.current.value);
    }

    return (
        <PopupWithForm
        onClose = {onClose} 
        isOpen = {isOpen}
        name = "avatar"
        title = "Обновить аватар"
        saveButton = "Сохранить"
        onSubmit = {handleSubmit}
        // isLoading = {isLoading}
      >
        <label className="popup__label">
            <input
              type="url"
              className="popup__input popup__input_avatar-link"
              id="avatarLink"
              placeholder="Введите ссылку"
              name="avatarLink"
              required
              ref={avatarRef}
            />
            <span className="popup__error" id="avatarLink-error"></span>
        </label> 
      </PopupWithForm>
    )
}

export default EditAvatarPopup;
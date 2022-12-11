import {useEffect} from 'react';
import PopupWithForm from './PopupWithForm';
//import {useFormAndValidation} from '../hooks/useFormAndValidation';
import {useForm} from '../hooks/useForm';


function AddPlacePopup ({onClose, isOpen, changeAddCard}){
  //const {values, handleChange, errors, isValid, resetForm, setValues} = useFormAndValidation()

  const cardNew =  useForm({name:'', link:''});
  
  //очистить инпут при открытии
  useEffect(()=>{
    cardNew.setValues({name:'', link:''});
  },[isOpen]); 

  function handleSubmit(evt) {
    evt.preventDefault();
      changeAddCard({
        name: cardNew.values.name,
        link: cardNew.values.link,
     });
  }

  return (
    <PopupWithForm
      onClose = {onClose}
      isOpen = {isOpen}
      name = "card"
      title = "Новое место"
      saveButton = "Создать"
      onSubmit = {handleSubmit}
      // isLoading = {isLoading}
    >
      <label className="popup__label">
        <input
          type="text"
          className="popup__input popup__input_image-title"
          id="imageTitle"
          placeholder="Название"
          name="name"
          required
          minLength="2"
          maxLength="40"
          value={cardNew.values.name ?? ''}
          onChange={cardNew.handleChange}
        />
        <span className="popup__error" id="imageTitle-error"></span>
      </label>  
      <label className="popup__label">
        <input
          type="url"
          className="popup__input popup__input_image-link"
          id="imageLink"
          placeholder="Ссылка на картинку"
          name="link"
          required
          value={cardNew.values.link ?? ''}
          onChange={cardNew.handleChange}
        />
        <span className="popup__error" id="imageLink-error"></span>
      </label>
    </PopupWithForm>
  );
}
  
  export default AddPlacePopup;
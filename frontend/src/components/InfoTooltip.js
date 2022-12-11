
import SuccessIcon from '../images/success.png';
import ErrorIcon from '../images/fail.png';

function InfoTooltip({isOpen, onClose, statusDescription, answer}) {

  return (
    <>
    <div className={`popup popup_type_result ${isOpen && 'popup_opened'}`}>
      <div className="popup__container popup__container_info-tooltip">
        <button className="popup__close-button" aria-label="Закрыть" onClick={onClose}></button>
        <img src={answer ? SuccessIcon : ErrorIcon} 
          alt={answer ? "Успех" : "Ошибка"}
          className="popup__icon"
        />
        <h2 className="popup__title popup__title_info-tooltip">{
          statusDescription
        }</h2> 
      </div>
    </div>
    </>
  )  
}

export default InfoTooltip;
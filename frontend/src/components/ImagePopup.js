function ImagePopup({card, onClose}){
 
  return (
    <div className={`popup popup_type_image ${card.name ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_image">
        <button type="button" className="popup__close-button" onClick={onClose}></button>
        <figure className="popup__image-group">
          <img className="popup__image" src={card.link} alt={card.name} />
          <figcaption className="popup__image-caption">{card.name}</figcaption>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;
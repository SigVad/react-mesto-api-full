import trash from '../images/element/__trash-button/trash.svg';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import { useContext } from 'react';

function Card({card, onCardClick, onCardDelete, onCardLike}) {
  
  const currentUser = useContext(CurrentUserContext);
  // являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;
  const elementTrashButtonClassName = (
    `element__trash-button ${isOwn ? '' : 'element__trash-button_hidden'}`
  ); 

  // есть ли у карточки лайк юзера
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const elementLikeButtonClassName = (
    `element__like-button ${isLiked ? 'element__like-button_active' : ''}`
  ); ; 

  return (
      <li className="element" id={card._id}>
        <img
          className="element__image"
          src={card.link}
          alt={card.name}
          onClick={() => {onCardClick(card)}}
        />
        <button
          type="button"
          className={elementTrashButtonClassName}
          onClick={() => {onCardDelete(card)}}
        >
          <img className="element__trash-button_image" width="18px" height="19px" src={trash} alt="корзина" />
        </button>
        <div className="element__content">
          <h2 className="element__title">{card.name}</h2>
          <div className="element__like">
            <button
              type="button"
              className={elementLikeButtonClassName}
              onClick={() => {onCardLike(card)}}
            ></button>
            <span className="element__like-number">{(card.likes.length)}</span>
          </div>
        </div>
      </li> 
  );
}

export default Card;
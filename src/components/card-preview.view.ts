import { CDN_URL } from '../utils/constants';
import { ProductApiModel } from '../types/products.model';
import { EventEmitter } from './base/events';
import { clickOnAddToBasketButtonEventName } from './events';

export class CardPreviewView {
  protected template: HTMLElement;
  private eventEmitter: EventEmitter;
  
  constructor(eventEmitter: EventEmitter){
    const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    this.template = cardPreviewTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this.eventEmitter = eventEmitter;
  }

  createElement(card: ProductApiModel, isItemInBasket: boolean): HTMLElement{
    const cardElement = this.template.cloneNode(true) as HTMLElement;
    const cardTitle = cardElement.querySelector('.card__title');
    const cardCategory = cardElement.querySelector('.card__category');
    const cardPrice = cardElement.querySelector('.card__price');
    const cardImage = cardElement.querySelector('.card__image');
    const cardText = cardElement.querySelector('.card__text');

    cardTitle.textContent = card.title;
    cardCategory.textContent = card.category;
    if(card.category === 'софт-скил'){
      cardCategory.classList.add('card__category_soft');
    } else if(card.category === 'другое'){
      cardCategory.classList.add('card__category_other');
    } else if(card.category === 'дополнительное'){
      cardCategory.classList.add('card__category_additional');
    } else if(card.category === 'кнопка'){
      cardCategory.classList.add('card__category_button');
    } else if(card.category === 'хард-скил'){
      cardCategory.classList.add('card__category_hard');
    }
    cardImage.setAttribute('src', `${CDN_URL}${card.image}`);
    cardText.textContent = card.description;
    if(card.price === null || card.price === 0){
      cardPrice.textContent = `Бесценно`;
    } else {
      cardPrice.textContent = `${card.price} синапсов`;
    }

    const addToBasketButton = cardElement.querySelector('.card__button');
    if(isItemInBasket || card.price === null || card.price === 0){
      addToBasketButton.setAttribute('disabled', 'disabled');
    } else {
      addToBasketButton.removeAttribute('disabled');
    } //

    addToBasketButton.addEventListener('click', () => {
      this.eventEmitter.emit(clickOnAddToBasketButtonEventName)
    })

    return cardElement;
  }

  setDisabled(button: HTMLElement){
    button.setAttribute('disabled', 'disabled');
  }
}

// создает карточку для модального окна
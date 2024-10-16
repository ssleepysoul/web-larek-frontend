import { ProductApiModel } from '../types/products.model';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';
import { openCardElementEventName } from './events';

export class CardView {
  protected template: HTMLElement;
  eventEmitter: EventEmitter;
  cardListElement: HTMLElement;

  constructor(eventEmitter: EventEmitter){
    const templateCardCatalog = document.querySelector("#card-catalog") as HTMLTemplateElement;
    this.template = templateCardCatalog.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this.eventEmitter = eventEmitter;
    this.cardListElement = document.querySelector('.gallery');
  }

  render(card: ProductApiModel){
    const cardElement = this.template.cloneNode(true) as HTMLElement; // г??
    const cardTitle = cardElement.querySelector('.card__title');
    const cardCategory = cardElement.querySelector('.card__category');
    const cardPrice = cardElement.querySelector('.card__price');
    const cardImage = cardElement.querySelector('.card__image');

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
    if(card.price === null || card.price === 0){
      cardPrice.textContent = `Бесценно`;
    } else {
      cardPrice.textContent = `${card.price} синапсов`;
    }

    cardElement.addEventListener('click', () => {
      this.eventEmitter.emit(openCardElementEventName, card);
    });

    return cardElement;
  }
}
//создает карточку из тэмплэйта, вешается событие на клик
import { CDN_URL } from '../utils/constants';
import { ProductApiModel } from '../types/products.model'

export class CardPreviewView {
  protected template: HTMLElement;
  
  constructor(){
    const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    this.template = cardPreviewTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
  }

  createElement(card: ProductApiModel): HTMLElement{
    const cardElement = this.template.cloneNode(true) as HTMLElement;
    const cardTitle = cardElement.querySelector('.card__title');
    const cardCategory = cardElement.querySelector('.card__category');
    const cardPrice = cardElement.querySelector('.card__price');
    const cardImage = cardElement.querySelector('.card__image');
    const cardText = cardElement.querySelector('.card__text');

    cardTitle.textContent = card.title;
    cardCategory.textContent = card.category;
    cardImage.setAttribute('src', `${CDN_URL}${card.image}`);
    cardText.textContent = card.description;
    if(card.price === null || card.price === 0){
      cardPrice.textContent = `Бесценно`;
    } else {
      cardPrice.textContent = `${card.price} синапсов`;
    }

    return cardElement;
  }
}

// создает карточку для модального окна
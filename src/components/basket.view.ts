import { BasketItemModel } from '../types/basket.model';
import { EventEmitter } from './base/events';
import { updateBasketItemsEventName, clickOnBasketButtonEventName, clickOnBasketEventName } from './events';

export class BasketView {
  templateBasket: HTMLElement;
  basketList: HTMLElement;
  basketItemIndex: HTMLElement;
  cardTitle: HTMLElement;
  cardPrice: HTMLElement;
  basketPrice: HTMLElement;
  counterPrice: number;
  basketItemDelete: HTMLElement;
  eventEmitter: EventEmitter;
  basketCounter: HTMLElement;

  constructor(eventEmitter: EventEmitter){
    const templateBasket = document.querySelector('#basket') as HTMLTemplateElement;
    this.templateBasket = templateBasket.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.basketList = this.templateBasket.querySelector('.basket__list');
    this.basketPrice = this.templateBasket.querySelector('.basket__price');
    this.eventEmitter = eventEmitter;
    this.basketCounter = document.querySelector('.header__basket-counter');

    const basket = document.querySelector('.header__basket');
    basket.addEventListener('click', () => {
      this.eventEmitter.emit(clickOnBasketEventName);
    }) // открытие корзины и отрисовка контента внутри корзины
  }

  render(basketItems: BasketItemModel []){
    this.basketList.innerHTML = '';
    this.counterPrice = 0;
    basketItems.forEach((item, index) => {
      const templateCardBasket = document.querySelector("#card-basket") as HTMLTemplateElement;
      const сardBasket = templateCardBasket.content.querySelector('.card').cloneNode(true) as HTMLElement;
      const basketItemIndex = сardBasket.querySelector('.basket__item-index');
      const cardTitle = сardBasket.querySelector('.card__title');
      const cardPrice = сardBasket.querySelector('.card__price');
      const basketItemDelete = сardBasket.querySelector('.basket__item-delete');
      basketItemIndex.textContent = `${index + 1}`;
      cardTitle.textContent = item.title;
      if(item.price === null || item.price === 0){
        cardPrice.textContent = `Бесценно`;
      } else {
        cardPrice.textContent = `${item.price} синапсов`;
      }
      this.counterPrice += item.price;
      this.basketPrice.textContent = `${this.counterPrice} синапсов`;
      
      basketItemDelete.addEventListener('click', () => {
        this.eventEmitter.emit(updateBasketItemsEventName, item);
        сardBasket.remove();
      })
      this.basketList.append(сardBasket);
    }) 

    const basketButton = this.templateBasket.querySelector('.basket__button');
    basketButton.addEventListener('click', () => {
      this.eventEmitter.emit(clickOnBasketButtonEventName);
    }) // закрывается модалка с товарами и открывается модалка с оплатой
  }

  clear(basketItems: BasketItemModel []){
    basketItems.splice(0, basketItems.length)
  }

  basketCounterUpdate(count: number){
    this.basketCounter.textContent = `${count}`;
  } 
}
import { CardView } from './cardView';
import { AppModel } from './app-model';
import { EventEmitter } from './base/events';
import { getCardsEventName, getCardByIdEventName, getBasketEventName, updateBasketItemsEventName, payCashEventName, payCardEventName, getOrderResponseEventName } from './events';
import { ProductApiModel } from '../types/products.model';
import { OrderApiResponseSuccessModel } from '../types/order.model';
import { ModalView } from './modalView';
import { CardPreviewView } from './cardPreviewView';
import { BasketView } from './basket-view';
import { OrderPaymentType } from '../types/order.model';
import { OrderView } from './order-view';
import { ContactsView } from './contacts-view';
import { SuccessView } from './success-view';

export class AppPresenter {
  cardView: CardView;
  appModel: AppModel;
  eventEmitter: EventEmitter;
  parentElement: HTMLElement;
  cardPreviewView: CardPreviewView;
  basketView: BasketView;
  orderView: OrderView;
  contactsView: ContactsView;
  successView: SuccessView;

  constructor(eventEmitter: EventEmitter, private modalView: ModalView){
    this.eventEmitter = eventEmitter;
    this.cardView = new CardView();
    this.appModel = new AppModel(this.eventEmitter);
    this.cardPreviewView = new CardPreviewView();
    this.appModel.getCards();
    this.parentElement = document.querySelector('.gallery');
    this.basketView = new BasketView(this.eventEmitter);
    this.orderView = new OrderView(this.eventEmitter);
    this.contactsView = new ContactsView();
    this.successView = new SuccessView();

    this.eventEmitter.on(getCardsEventName, () => {
      this.appModel.cardsObject.items.forEach((item: ProductApiModel) => {
        const cardElement = this.cardView.render(item);
        cardElement.addEventListener('click', () => {
          this.appModel.getCardById(item.id);
        });
        this.parentElement.append(cardElement);
      })
    }); //добавляет карточки на страницу и слушатель клика для открытия карточки


    this.eventEmitter.on(getCardByIdEventName, () => { //событие которое происходит после клика на карточку
      const cardElementPreview = this.cardPreviewView.createElement(this.appModel.cardById);
      this.modalView.open(cardElementPreview);
      const addToBasketButton = cardElementPreview.querySelector('.card__button');
      const isItemInBasket = !!this.appModel.basketItems.find((item) => {
        return item.id === this.appModel.cardById.id;
      })
      if(isItemInBasket){
        addToBasketButton.setAttribute('disabled', 'disabled');
      } else {
        addToBasketButton.removeAttribute('disabled');
      } //

      addToBasketButton.addEventListener('click', () => {
        this.appModel.basketItems.push(this.appModel.cardById);
        this.eventEmitter.emit(getBasketEventName);
        const basketCounter = document.querySelector('.header__basket-counter');
        basketCounter.textContent = `${this.appModel.basketItems.length}`; //дубль
      })
    }) // добавляет товар в корзину

    this.eventEmitter.on(getBasketEventName, () => {
      if(!this.modalView.modalContent){
        return;
      }
      const addToBasketButton = this.modalView.modalContent.querySelector('.card__button');
      const isItemInBasket = !!this.appModel.basketItems.find((item) => {
        return item.id === this.appModel.cardById.id;
      })
      if(isItemInBasket){
        addToBasketButton.setAttribute('disabled', 'disabled');
      }
    }) //кнопка становится неактивной если товар уже добавлен в корзину

    const basket = document.querySelector('.header__basket');
    basket.addEventListener('click', () => {
      let counterPrice = 0;
      this.appModel.basketItems.forEach((item) => {
        counterPrice += item.price;
      }) 
      if(counterPrice > 0){
        this.basketView.render(this.appModel.basketItems);
        this.modalView.open(this.basketView.templateBasket);
      }
    }) // открытие корзины и отрисовка контента внутри корзины

    this.eventEmitter.on(updateBasketItemsEventName, (data: ProductApiModel) => {
      this.appModel.basketItems = this.appModel.basketItems.filter(item => item.id !== data.id);
        this.basketView.counterPrice -= data.price;
        this.basketView.basketPrice.textContent = `${this.basketView.counterPrice} синапсов`;
        const basketCounter = document.querySelector('.header__basket-counter');
        basketCounter.textContent = `${this.appModel.basketItems.length}`;//дубль
    }) // удаление товара из корзины

    const basketButton = this.basketView.templateBasket.querySelector('.basket__button');
    basketButton.addEventListener('click', () => {
      this.modalView.close();
      this.modalView.open(this.orderView.orderTemplate);
      this.appModel.orderData.items = this.appModel.basketItems.map((item) => {
        return item.id
      })
      this.appModel.orderData.total = this.basketView.counterPrice;
    }) // закрывается модалка с товарами и открывается модалка с оплатой

    this.eventEmitter.on(payCardEventName, () => {
      this.appModel.orderData.payment = OrderPaymentType.online;
    }) //выбор типа оплаты онлайн

    this.eventEmitter.on(payCashEventName, () => {
      this.appModel.orderData.payment = OrderPaymentType.offline;
    }) //выбор типа оплаты офлайн

    const orderButton = this.orderView.orderTemplate.querySelector('.order__button');
    const orderFormError = this.orderView.orderTemplate.querySelector('.form__errors');
    const orderFormInput = this.orderView.orderTemplate.querySelector('.form__input') as HTMLInputElement;

    orderButton.addEventListener('click', (event) => {
      if(!orderFormInput.value) {
        event.preventDefault();
        orderFormError.textContent = orderFormInput.validationMessage;
      } else {
        event.preventDefault();
        this.appModel.orderData.address = orderFormInput.value;
        this.modalView.close();
        this.modalView.open(this.contactsView.contactsTemplate);
      }
    }) //валидация поля адрес и открытие модалки личных данных

    const payButton = this.contactsView.contactsTemplate.querySelector('.button');
    const payFormError = this.contactsView.contactsTemplate.querySelector('.form__errors');
    const payFormInputEmail = this.contactsView.contactsTemplate.querySelector('[name="email"]') as HTMLInputElement;
    const payFormInputPhone = this.contactsView.contactsTemplate.querySelector('[name="phone"]') as HTMLInputElement;


    payButton.addEventListener('click', (event) => {
      if(!payFormInputEmail.value || !payFormInputPhone.value || !payFormInputEmail.value && !payFormInputPhone.value ) {
        event.preventDefault();
        payFormError.textContent = payFormInputEmail.validationMessage || payFormInputPhone.validationMessage;
      } else {
        event.preventDefault();
        this.appModel.orderData.email = payFormInputEmail.value;
        this.appModel.orderData.phone = payFormInputPhone.value;
        this.appModel.postOrder(this.appModel.orderData);
      }
    })

    this.eventEmitter.on(getOrderResponseEventName, () => {
      this.modalView.close();
      this.modalView.open(this.successView.successTemplate);
      this.successView.successDescription.textContent = `Списано ${(this.appModel.orderResponse as OrderApiResponseSuccessModel).total} синапсов`;
      const basketCounter = document.querySelector('.header__basket-counter');
      basketCounter.textContent = `0`;

      this.basketView.clear(this.appModel.basketItems);
      this.appModel.basketItems = [];
    })

    this.successView.successButton.addEventListener('click', () => {
      this.modalView.close();
    })
  }
}
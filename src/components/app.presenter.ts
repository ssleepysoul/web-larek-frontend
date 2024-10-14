import { CardView } from './card.view';
import { AppModel } from './app.model';
import { EventEmitter } from './base/events';
import { getCardsEventName, getCardByIdEventName, getBasketEventName, updateBasketItemsEventName, payCashEventName, payCardEventName, getOrderResponseEventName, openCardElementEventName, clickOnSuccessButtonEventName, clickOnPayButtonEventName, clickOnOrderButtonEventName, clickOnBasketButtonEventName, clickOnBasketEventName, clickOnAddToBasketButtonEventName } from './events';
import { ProductApiModel } from '../types/products.model';
import { OrderApiResponseSuccessModel } from '../types/order.model';
import { ModalView } from './modal.view';
import { CardPreviewView } from './card-preview.view';
import { BasketView } from './basket.view';
import { OrderPaymentType } from '../types/order.model';
import { OrderView } from './order.view';
import { ContactsView } from './contacts.view';
import { SuccessView } from './success.view';

export class AppPresenter {
  cardView: CardView;
  appModel: AppModel;
  eventEmitter: EventEmitter;
  cardPreviewView: CardPreviewView;
  basketView: BasketView;
  orderView: OrderView;
  contactsView: ContactsView;
  successView: SuccessView;

  constructor(eventEmitter: EventEmitter, private modalView: ModalView){
    this.eventEmitter = eventEmitter;
    this.cardView = new CardView(this.eventEmitter);
    this.appModel = new AppModel(this.eventEmitter);
    this.cardPreviewView = new CardPreviewView(this.eventEmitter);
    this.appModel.getCards();
    this.basketView = new BasketView(this.eventEmitter);
    this.orderView = new OrderView(this.eventEmitter);
    this.contactsView = new ContactsView(this.eventEmitter);
    this.successView = new SuccessView(this.eventEmitter);

    this.eventEmitter.on(getCardsEventName, () => {
      this.appModel.cardsObject.items.forEach((item: ProductApiModel) => {
        const cardElement = this.cardView.render(item);
        this.cardView.cardListElement.append(cardElement);
      })
    }); //добавляет карточки на страницу

    this.eventEmitter.on(openCardElementEventName, (card: ProductApiModel) => {
      this.appModel.getCardById(card.id);
    }) //запрос на информацию о карточке

    this.eventEmitter.on(getCardByIdEventName, () => {
      const isItemInBasket = !!this.appModel.basketItems.find((item) => {
        return item.id === this.appModel.cardById.id;
      })
      const cardElementPreview = this.cardPreviewView.createElement(this.appModel.cardById, isItemInBasket);
      this.modalView.open(cardElementPreview);
    }) // открытие карточки

    this.eventEmitter.on(clickOnAddToBasketButtonEventName, () => {
      this.appModel.basketItems.push(this.appModel.cardById);
      this.eventEmitter.emit(getBasketEventName);
      this.basketView.basketCounterUpdate(this.appModel.basketItems.length);
    }) //

    this.eventEmitter.on(getBasketEventName, () => {
      if(!this.modalView.modalContent){
        return;
      }
      const addToBasketButton = this.modalView.modalContent.querySelector('.card__button') as HTMLElement;
      const isItemInBasket = !!this.appModel.basketItems.find((item) => {
        return item.id === this.appModel.cardById.id;
      })
      if(isItemInBasket){
        this.cardPreviewView.setDisabled(addToBasketButton);
      }
    }) //кнопка становится неактивной если товар уже добавлен в корзину


    this.eventEmitter.on(clickOnBasketEventName, () => {
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
        this.basketView.basketCounterUpdate(this.appModel.basketItems.length)
    }) // удаление товара из корзины

    this.eventEmitter.on(clickOnBasketButtonEventName, () => {
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


    this.eventEmitter.on(clickOnOrderButtonEventName, () => {
      if(!this.orderView.orderFormInput.value) {
        event.preventDefault();
        this.orderView.orderFormError.textContent = this.orderView.orderFormInput.validationMessage;
      } else {
        event.preventDefault();
        this.appModel.orderData.address = this.orderView.orderFormInput.value;
        this.modalView.close();
        this.modalView.open(this.contactsView.contactsTemplate);
      }
    }) //валидация поля адрес и открытие модалки личных данных

    this.eventEmitter.on(clickOnPayButtonEventName, () => {
      if(!this.contactsView.payFormInputEmail.value || !this.contactsView.payFormInputPhone.value || !this.contactsView.payFormInputEmail.value && !this.contactsView.payFormInputPhone.value ) {
        event.preventDefault();
        this.contactsView.payFormError.textContent = this.contactsView.payFormInputEmail.validationMessage || this.contactsView.payFormInputPhone.validationMessage;
      } else {
        event.preventDefault();
        this.appModel.orderData.email = this.contactsView.payFormInputEmail.value;
        this.appModel.orderData.phone = this.contactsView.payFormInputPhone.value;
        this.appModel.postOrder(this.appModel.orderData);
      }
    }) //клик на кнопку оплатить

    this.eventEmitter.on(getOrderResponseEventName, () => {
      this.modalView.close();
      this.modalView.open(this.successView.successTemplate);
      this.successView.successDescription.textContent = `Списано ${(this.appModel.orderResponse as OrderApiResponseSuccessModel).total} синапсов`;
      this.basketView.basketCounterUpdate(0)

      this.basketView.clear(this.appModel.basketItems);
      this.appModel.basketItems = [];
    })

    this.eventEmitter.on(clickOnSuccessButtonEventName, () => {
      this.modalView.close();
    })
  }
}
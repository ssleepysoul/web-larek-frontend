import { ProductListApiModel, ProductApiModel } from '../types/products.model';
import { OrderApiRequestModel, OrderApiResponseSuccessModel, OrderApiResponseErrorModel } from '../types/order.model';
import { API_URL } from '../utils/constants';
import { Api } from './base/api';
import { EventEmitter } from './base/events';
import { getCardsEventName, getCardByIdEventName, getOrderResponseEventName } from './events';

export class AppModel {
  cardsRequestApi: Api;
  cardsObject: ProductListApiModel;
  eventEmitter: EventEmitter;
  cardById: ProductApiModel;
  basketItems: ProductApiModel[];
  orderData: OrderApiRequestModel;
  orderResponse: OrderApiResponseSuccessModel | OrderApiResponseErrorModel;

  constructor(eventEmitter: EventEmitter ){
    this.cardsRequestApi = new Api(API_URL);
    this.eventEmitter = eventEmitter;
    this.basketItems = [];
    this.orderData = {
      payment: null,
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: []
    };
}
  getCards():void{
    this.cardsRequestApi.get('/product/').then((res) => {
      this.cardsObject = res as ProductListApiModel;
      this.eventEmitter.emit(getCardsEventName);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  getCardById(cardId: string):void{
    this.cardsRequestApi.get(`/product/${cardId}`).then((res) => {
      this.cardById = res as ProductApiModel;
      this.eventEmitter.emit(getCardByIdEventName);
    })
    .catch((err) => {
      console.log(err); 
    })
  }

  postOrder(orderData: OrderApiRequestModel):void{
    this.cardsRequestApi.post('/order', orderData).then((res) => {
      this.orderResponse = res as OrderApiResponseSuccessModel | OrderApiResponseErrorModel;
      this.eventEmitter.emit(getOrderResponseEventName);
    })
    .catch((err) => {
      console.log(err); 
    })
  }
}

//запрос на сервер на получение всех карточек
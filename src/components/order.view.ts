import { EventEmitter } from './base/events';
import { payCardEventName, payCashEventName, clickOnOrderButtonEventName } from './events';

export class OrderView {
  orderTemplate: HTMLElement;
  eventEmitter: EventEmitter;
  orderButton: HTMLElement;
  orderFormError: HTMLElement;
  orderFormInput: HTMLInputElement;

  constructor(eventEmitter: EventEmitter) {
    const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
    this.orderTemplate = orderTemplate.content.querySelector('.form').cloneNode(true) as HTMLElement;
    this.eventEmitter = eventEmitter;

    const cardButton = this.orderTemplate.querySelector('[name="card"]');
    const cashButton = this.orderTemplate.querySelector('[name="cash"]');
    const orderButtons = this.orderTemplate.querySelector('.order__buttons');
    cardButton.addEventListener('click', () => {
      cardButton.classList.toggle('button_alt_active');
      cardButton.classList.toggle('button_alt');
      cashButton.classList.remove('button_alt_active');
      cashButton.classList.add('button_alt');
      this.eventEmitter.emit(payCardEventName);
      const dataValue = orderButtons.getAttribute('data-value');
      if(dataValue === 'payCard'){
        orderButtons.removeAttribute('data-value');
      } else {
        orderButtons.setAttribute('data-value', 'payCard')
      }
      if(this.orderFormInput.value === '' || !orderButtons.getAttribute('data-value')){
        this.orderButton.setAttribute('disabled', 'disabled');
      } else {
        this.orderButton.removeAttribute('disabled');
      }
    })
    cashButton.addEventListener('click', () => {
      cashButton.classList.toggle('button_alt_active');
      cashButton.classList.toggle('button_alt');
      cardButton.classList.remove('button_alt_active');
      cardButton.classList.add('button_alt');
      this.eventEmitter.emit(payCashEventName);
      const dataValue = orderButtons.getAttribute('data-value');
      if(dataValue === 'payCash'){
        orderButtons.removeAttribute('data-value');
      } else {
        orderButtons.setAttribute('data-value', 'payCash')
      }
      if(this.orderFormInput.value === '' || !orderButtons.getAttribute('data-value')){
        this.orderButton.setAttribute('disabled', 'disabled');
      } else {
        this.orderButton.removeAttribute('disabled');
      }
    }) //обработчик клика выбора метода оплаты

    
    this.orderButton = this.orderTemplate.querySelector('.order__button');
    this.orderFormError = this.orderTemplate.querySelector('.form__errors');
    this.orderFormInput = this.orderTemplate.querySelector('.form__input') as HTMLInputElement;
    this.orderButton.setAttribute('disabled', 'disabled');

    this.orderButton.addEventListener('click', (event) => {
      this.eventEmitter.emit(clickOnOrderButtonEventName);
    });//валидация поля адрес и открытие модалки личных данных

    this.orderFormInput.addEventListener('input', (event: InputEvent) => {
      if((event.target as HTMLInputElement).value === '' || !orderButtons.getAttribute('data-value')){
        this.orderButton.setAttribute('disabled', 'disabled');
      } else {
        this.orderButton.removeAttribute('disabled');
      }
    });
  }
}
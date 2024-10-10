import { EventEmitter } from './base/events';
import { payCardEventName, payCashEventName } from './events';

export class OrderView {
  orderTemplate: HTMLElement;
  eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
    this.orderTemplate = orderTemplate.content.querySelector('.form').cloneNode(true) as HTMLElement;
    this.eventEmitter = eventEmitter;

    const cardButton = this.orderTemplate.querySelector('[name="card"]');
    const cashButton = this.orderTemplate.querySelector('[name="cash"]');
    cardButton.addEventListener('click', () => {
      cardButton.classList.toggle('button_alt_active');
      cardButton.classList.toggle('button_alt');
      cashButton.classList.remove('button_alt_active');
      cashButton.classList.add('button_alt');
      this.eventEmitter.emit(payCardEventName);
    })
    cashButton.addEventListener('click', () => {
      cashButton.classList.toggle('button_alt_active');
      cashButton.classList.toggle('button_alt');
      cardButton.classList.remove('button_alt_active');
      cardButton.classList.add('button_alt');
      this.eventEmitter.emit(payCashEventName)
    }) //обработчик клика выбора метода оплаты
  }
}
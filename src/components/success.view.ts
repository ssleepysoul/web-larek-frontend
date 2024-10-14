import { clickOnSuccessButtonEventName } from './events';
import { EventEmitter } from './base/events';

export class SuccessView {
  successTemplate: HTMLElement;
  successDescription: HTMLElement;
  successButton: HTMLElement;
  eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
    this.successTemplate = successTemplate.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.successDescription = this.successTemplate.querySelector('.order-success__description');
    this.successButton = this.successTemplate.querySelector('.order-success__close');
    this.eventEmitter = eventEmitter;

    this.successButton.addEventListener('click', () => {
      this.eventEmitter.emit(clickOnSuccessButtonEventName);
    })
  }
}
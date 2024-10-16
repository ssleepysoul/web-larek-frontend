import { EventEmitter } from "./base/events";
import { clickOnPayButtonEventName } from './events';

export class ContactsView {
  contactsTemplate: HTMLElement;
  eventEmitter: EventEmitter;
  payButton: HTMLElement;
  payFormError: HTMLElement;
  payFormInputEmail: HTMLInputElement;
  payFormInputPhone: HTMLInputElement;

  constructor(eventEmitter: EventEmitter) {
    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    this.contactsTemplate = contactsTemplate.content.querySelector('.form').cloneNode(true) as HTMLElement;
    this.eventEmitter = eventEmitter;

    this.payButton = this.contactsTemplate.querySelector('.button');
    this.payFormError = this.contactsTemplate.querySelector('.form__errors');
    this.payFormInputEmail = this.contactsTemplate.querySelector('[name="email"]');
    this.payFormInputPhone = this.contactsTemplate.querySelector('[name="phone"]');

    this.payButton.addEventListener('click', (event) => {
      this.eventEmitter.emit(clickOnPayButtonEventName);
    })

    this.payButton.setAttribute('disabled', 'disabled');

    this.payFormInputEmail.addEventListener('input', (event: InputEvent) => {
      if((event.target as HTMLInputElement).value === '' || this.payFormInputPhone.value === ''){
        this.payButton.setAttribute('disabled', 'disabled');
      } else {
        this.payButton.removeAttribute('disabled');
      }
    });

    this.payFormInputPhone.addEventListener('input', (event: InputEvent) => {
      if((event.target as HTMLInputElement).value === '' || this.payFormInputEmail.value === ''){
        this.payButton.setAttribute('disabled', 'disabled');
      } else {
        this.payButton.removeAttribute('disabled');
      }
    });
  }
}
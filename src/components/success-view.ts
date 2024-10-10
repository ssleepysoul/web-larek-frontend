export class SuccessView {
  successTemplate: HTMLElement;
  successDescription: HTMLElement;
  successButton: HTMLElement;

  constructor() {
    const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
    this.successTemplate = successTemplate.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.successDescription = this.successTemplate.querySelector('.order-success__description');
    this.successButton = this.successTemplate.querySelector('.order-success__close');
  }
}
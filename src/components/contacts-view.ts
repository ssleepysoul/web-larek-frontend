export class ContactsView {
  contactsTemplate: HTMLElement;

  constructor() {
    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    this.contactsTemplate = contactsTemplate.content.querySelector('.form').cloneNode(true) as HTMLElement;
  }
}
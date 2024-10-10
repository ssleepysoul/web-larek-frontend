export class ModalView {
  modal: HTMLElement;
  modalContentContainer: HTMLElement;
  page: HTMLElement;
  closeButton: HTMLElement;
  modalContent: HTMLElement | null;

  constructor(){
    this.modal = document.querySelector('#modal-container');
    this.modalContentContainer = this.modal.querySelector('.modal__content');
    this.page = document.querySelector('.page__wrapper');
    this.closeButton = this.modal.querySelector('.modal__close');
    this.modalContent = null;
    this.closeButton.addEventListener('click', () => {
      this.close();
    })
    this.modal.addEventListener('click', (event) => {
      if(event.target === this.modal) {
        this.close();
      }
    }); 
  }

  render(modalContentElement: HTMLElement){
    this.modalContentContainer.append(modalContentElement);
    this.modalContent = modalContentElement;
  }

  open(modalContentElement: HTMLElement){
    this.render(modalContentElement)
    this.modal.classList.add('modal_active');
    this.page.classList.add('page__wrapper_locked');
  }

  close(){
    this.modal.classList.remove('modal_active');
    this.page.classList.remove('page__wrapper_locked');
    this.modalContentContainer.innerHTML = '';
    this.modalContent = null;
  }
}
// класс который подставляет контент модалки в модальное окно
import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppPresenter } from './components/app.presenter';
import { ModalView } from './components/modal.view';


const eventEmitter = new EventEmitter();
const modalView = new ModalView();
const appPresenter = new AppPresenter(eventEmitter, modalView);

//поправить название файлов app.model.ts
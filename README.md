# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


[//]: # (Используемый стек.)

[//]: # (Описание базовых классов, их предназначение и функции.)

## Архитектура проекта

### Общий подход: 
Приложение представляет собой набор обособленных блоков: Products - список товаров + карточка товара, 
Basket - корзина и Order - заказ. Взаимодействие между блоками осуществляется при помощи двух сущностей, глобального 
состояния GlobalState, которое является хранилищем общих данных и шиной/брокером событий.

**Блоки** - представляют собой логически законченную функциональность. Реализованы с помощью паттерна MVP. Блок 
взаимодействует с другим блоком через события. У каждого блока есть: модель данных, набор представлений, отвечающих 
за отрисовку шаблонов и презентер - связующее звено, реализующее основную логику блока.

GlobalState хранит в себе те данные, которые нужны всем блокам приложения. Для текущего приложения это Products 
(список товаров), он нужен как для отрисовки списка товаров, так и для списка товаров в корзине.

EventBus - глобальная шина событий отвечающая за коммуникацию между блоками.

### Описание реализации

### Глобальные части системы:

#### GlobalState 
Класс состояния. Создается при инициализации приложения.
Поля:
- products: ProductApiModel[] (private) - оригинальные данные списка товаров

Методы:
- updateProducts(value: ProductApiModel[]): void (public) - обновляет поле products
- getProducts(): ProductApiModel[] (public) - возвращает значение поля products


#### EventBus 
Класс шины собитий. Создается при инициализации приложения.

События:
- addProductToBasketEvent - передает в качестве данных ID продукта
- createOrderEvent - передает в качестве параметра список из ID продуктов, находящихся в корзине 
- updateProductsEvent - сигнализирует о том что список продуктов в GlobalState обновился

_____________________________________________________________________________________________________________________

### Блоки:

Для каждого блока создаем класс-обертку, в которых выполняем инициализацию MVP классов.

#### Блок Products: 

Содержит всю логику, относящуюся к отрисовке списка товаров и карточки товара:
- получение данных по списку товаров;
- отрисовка списка товаров;
- открытие модального окна с превью товара;
- получение товара по его ID;
- обработка клика по карточке товара в списке;

Осуществляет взаимодействие с сервером при помощи 2-х запросов: получение списка товаров и получение товара по id. 
Внешнее взаимодействие блока включает запись результата запроса получения списка товаров в GlobalState, отправку 
события addProductToBasket, обработку события updateProducts. Блок разбит на 3 основные части: модель данных, 
представление и презентер. Связь между презентером, моделью и представлением осуществляется через callback-вызовы, 
которые передаются в публичные методы. Такой тип связи выбран потому что блок представляет собой замкнутую систему и 
использовать брокер событий внутри блока кажется излишним.

##### Products: 
Класс-обертка. Создается при инициализации приложения.

##### ProductsModel:
Класс, модель данных, хранит данные, взаимодествиует с сервером. Создается в Products.
Поля:
- list: ProductApiModel[] (private);
- preview: ProductApiModel | null (private);

Методы:
- updateList(value: ProductApiModel[]): void (public) - обновляем поле list;
- updatePreview(value: ProductApiModel | null): void (public) - обновляем поле preview;
- getList(): ProductApiModel[] (public) - возвращаем значение поля list;
- getPreview(): ProductApiModel | null (public) - возврашаем значение поля preview;
- loadList(callback: () => void): void (public) - получаем данные списка продуктов от сервера, callback-функция запускается в ответе промиса;
- loadProductById(productId: ProductId, callback: () => void): void (public) получаем данные по продукту от сервера, callback-функция запускается в ответе промиса;


Представление реализуется через 3 класса: список продуктов(ProductsListView) и карточка продукта(ProductsCardView), 
которую мы будем использовать в 2-х местах: для отрисовки элемета списка и отрисовки открытой карточки продукта 
и превью товара - ProductsPreviewView, отвечающее за модальное окно превью и отрисовку в нем ProductsCardView

##### ProductsListView: 
Класс представления. Создается в Products.
Поля:
- listElement: HTMLElement (private) - ссылка на html-элемент с классом ".gallery";
- listItemView: ProductsCardView (private) - экземпляр класса ProductsCardView, созданного с параметром list;

Методы: 
- render(listData: ProductApiModel[], callback: () => void): void (public) - логика добавления элементов списка в listElement. При вызове метода действие 
начинается с полной очистки элементов в listElement с последующим добавлением элементов 
на основе поля listData и вызова мметода render у listItemView;

##### ProductsCardView: 
Класс представления. Создается в зависмости от использования либо в ProductsListView, либо в ProductsPreviewModalView.

Параметры конструктора:
- templateType: string;

В конструкторе происходит установка всех полей класса  templateType 
устанавливаются из соответствующего параметра, listTemplateElement и previewTemplateElement 
устанавливаются через поиск соответствующих DOM элементов

Поля:
- listTemplateElement: HTMLElement (private) - ссылка на шаблон карточки для списка, "#card-catalog";
- previewTemplateElement: HTMLElement (private) - ссылка на шаблон карточки в модальном окне, "#card-preview";
- templateType: string (private) поле хранит в себе тип шаблона(list или preview), передается в качестве параметра при создании экземпляра 
класса;

Методы:
- render(cardData: ProductApiModel, parentElement: HTMLElement, callback: () => void): void (public) - в методе описана логика 
добавления карточки товара в parentElement. В зависимости от templateType запускаются addClickBySelfEventListener или addClickOnBuyButtonEventListener
- addClickBySelfEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по самой карточке
- addClickOnBuyButtonEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по кнопке Купить
по карточке с последующим запуском колбэка

##### ProductsPreviewModalView: 
Класс представления. Создается в Products.
Поля:
- contentView: ProductsCardView (private) - экземпляр класс ProductsCardView с типом шаблона - preview,
- modalElement: HTMLElement (private) - ссылка на элемент модального окна 
(на данный момент в файле src/pages/index.html нет уникального идентификатора для этого элемента)

Методы:
- open(cardData: ProductApiModel, callback: () => void): void (public) - осуществляет показ модального окна modalElement и запускает cardView.render
- close(): void (public) - осуществляет скрытие модального окна modalElement
- addCloseEventListener(): void (private) - добавляет слушатель click для кнопки закрыть в modalElement. Запускается в конструкторе после устанорки значения для modalElement,
- getContentView(): ProductsCardView (public)


##### ProductsPresenter: 
Представляет собой класс который осуществляет взаимодействие между View и Model. Создается при инициализации приложения. 

Параметры конструктора:
- views: {list: ProductsListView, preview: ProductsPreviewModalView} -  объект с представлениями,
- models: {products: ProductsModel} - объект с моделями,
- globals: {events: EventBus, state: GlobalState} - объект с глобальными частями системы

Поля:
- listView: ProductsListView (private)
- previewView: ProductsPreviewModalView (private) 
- productsModel: ProductsModel (private) 
- events: EventBus (private)
- state: GlobalState (private)

Поля заполняются в конструкторе из соответствующих параметров.

Методы:
- init(): void (public) - В методе происходит инициализация блока продуктов, запуск productsModel.loadList с передачей callback - onloadProducts, а так же подписка на событие updateProductsEvent где мы запускаем onProductsUpdate
- onloadProducts(): void (private) — callback который передается в productsModel.loadList, в нем мы обновляем глобальный список продуктов - state.updateProducts и запускаем событие events.updateProductsEvent
- onProductClick(productId: string): void (private) — Реагирует на клик по продукту, открывает модалку. Запускает productsModel.loadProductById, передавая в него callback, в котором запускаем previewView.open передавая в него onBuyButtonClick
- onBuyButtonClick(productId: string): void (private) — callback который передается в previewView.open, в этом методе посылаем событие addProductToBasketEvent
- onProductsUpdate(): void (private) — обновляем локальную модель списка (productsModel.updateList) и запускаем отрисовку списка (listView.render), передавая в него значения из локальной модели, onProductClick

_____________________________________________________________________________________________________________________

#### Блок Basket
Содержит всю логику, относящуюся к отрисовке корзины:
- добавление количества товара для значка корзины в шапке;
- клик по значку корзины в шапке;
- открытие модального окна корзины;
- добавление товара в корзину;
- клик по кнопке Оформить;

С сервером не взаимодействует. Блок разбит на 3 основные части: модель данных,
представление и презентер. Связь между презентером, моделью и представлением осуществляется через callback-вызовы

##### Basket:
Класс-обертка. Создается при инициализации приложения.

##### BasketModel:
Класс, модель данных, хранит данные. Создается в Basket.
Поля:
- list: ProductApiModel[] (private);
- fullPrice: number | null (private);

Методы:
- updateList(value: ProductApiModel[]): void (public) - обновляем значение поля list;
- updateFullPrice(value: ProductApiModel[]): void (public) - обновляем значение поля fullPrice;
- getItems(): ProductApiModel[] (public) - возвращаем значения поля list;
- getFullPrice(): number | null (public) - возврашаем значение поля fullPrice;
- addItemIntoList(item: ProductApiModel): ProductApiModel[] (public) - добавляем товар в список list;
- removeItemFromList(item: ProductApiModel): ProductApiModel[] (public) - удаляем товар из списка list;

##### BasketHeaderView:
Класс представления. Создается при инициализации приложения в Basket.

В конструкторе происходит установка всех полей класса

Поля:
- basketElement: HTMLElement (private) - ссылка на  ".header__basket";
- basketCounterElement: HTMLElement (private) - ссылка на  ".header__basket-counter";

Методы:
- updateCount(count: number): void (public) - добавляем количество товаров для ".header__basket-counter"
- addClickEventListener(callback: () => void): void (public) - В методе добавляется eventListener на клик по самой карточке и запускаем callback

##### BasketView:
Класс представления. Создается в BasketModalView.

В конструкторе происходит установка всех полей класса

Поля:
- basketTemplateElement: HTMLElement (private) - ссылка на шаблон корзины, "#basket";
- basketCardView: BasketCardView (private);

Методы:
- render(list: ProductApiModel[], fullPrice: number, parentElement: HTMLElement, callback: () => void): void (public) - в методе описана логика
  добавления корзины в parentElement, отрисовка списка товаров в корзине с помощью basketCardView.render,  а так же установка слушателя для кнопки Оформить - addClickOnOrderButtonEventListener
- addClickOnOrderButtonEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по кнопке Оформить
  с последующим запуском callback

##### BasketCardView:
Класс представления. Создается в BasketView.

В конструкторе происходит установка всех полей класса

Поля:
- basketTemplateElement: HTMLElement (private) - ссылка на шаблон корзины, "#basket";
- basketCardView: BasketCardView (private);

Методы:
- render(cardData: ProductApiModel, parentElement: HTMLElement, callback: () => void): void (public) - в методе описана логика
  добавления карточки товара в parentElement. Для каждой карточки добавляем data-id со зачением ID продукта
- addClickOnRemoveButtonEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по кнопке Удалить с последующим запуском callback

##### BasketModalView:
Класс представления. Создается при инициализации приложения.
Поля:
- contentView: BasketView (private) - экземпляр класс BasketView;
- modalElement: HTMLElement (private) - ссылка на элемент модального окна;
  (на данный момент в файле src/pages/index.html нет уникального идентификатора для этого элемента)

Методы:
- open(list: ProductApiModel[], fullPrice: number, removeItemCallback: () => void, goToOrderCallback: () => void): void (public) - осуществляет показ модального окна modalElement и запускает contentView.render
- close(): void (public) - осуществляет скрытие модального окна modalElement
- addCloseEventListener(): void (private) - добавляет слушатель click для кнопки закрыть в modalElement.
  Запускается в конструкторе после устанорки значения для modalElement,

##### BasketPresenter:
Представляет собой класс, который осуществляет взаимодействие между View и Model. Создается при инициализации приложения.

Параметры конструктора:
- views: {header: BasketHeaderView, modal: BasketModalView} -  объект с представлениями,
- models: {basket: BasketModel} - объект с моделями,
- globals: {events: EventBus, state: GlobalState} - объект с глобальными частями системы

Поля:
- headerView: BasketHeaderView (private)
- modalView: BasketModalView (private)
- basketModel: BasketModel (private)
- events: EventBus (private)
- state: GlobalState (private)

Поля заполняются в конструкторе из соответствующих параметров.

Методы:
- init(): void (public) - подписка на событие addProductToBasketEvent где мы запускаем onAddItem.  И запускаем headerView.addClickEventListener, с callback в котором запускаем modalView.open в который в качестве callback-ов передаем onRemoveItem и onOrderButtonClick, подписка на событие clearBasket в котором сбрасываем модель корзины, и счетчик в шапке
- onAddItem(productId: string): void (private) — callback, запускаем basketModel.addItemIntoList, basketModel.updateList,  basketModel.updateFullPrice и headerView.updateCount. Смысл в том чтобы найти модель продукта в state по ID, добавить этот продукт в модель, обновить модель, обновиь количество в шапке сайта
- onRemoveItem(productId: string): void (private) — Удаляем товар из модели basketModel.removeItemFromList, обновляет модель basketModel.updateList, обновляем прайс basketModel.updateFullPrice и обновляем каунт в шапке headerView.updateCount и запускаем ререндер всей корзины - modalView.contentView.render
- onOrderButtonClick(productId: string): void (private) — callback, в этом методе посылаем событие createOrderEventпередаем в событие список из id продуктов в корзине, и. закрываем модалку корзины modalView.close

_____________________________________________________________________________________________________________________


#### Блок Order
Содержит всю логику, относящуюся к заказу
- добавлени количества товара для значка корзины в шапке
- клик по значку корзины в шапке
- открытие модального окна корзины
- добавление товара в корзинуклик по кнопке Оформить

С сервером не взаимодействует. Блок разбит на 3 основные части: модель данных,
представление и презентер. Связь между презентером, моделью и представлением осуществляется через callback-вызовы

Для блока Order так же определяем вспомогательный класс OrderValidation который будет отвечать за валидацию форм в шагах

##### Order:
Класс-обертка. Создается при инициализации приложения.

##### OrderModel:
Класс, модель данных, хранит данные, взаимодествиует с сервером. Создается в Order.
Поля:
- data: OrderApiRequestModel;

Методы:
- updateData(value: OrderApiRequestModel): void (public) - обновляем поле data;
- getData(): OrderApiRequestModel (public) - возвращаем значение поля data;
- sentOrder(callback: () => void): void (public) - отправляем данные заказа на сервер, callback-функция запускается в ответе промиса;

##### OrderModalView:
Класс представления. Создается при инициализации приложения.
Поля:
- orderMainView: OrderView (private) - экземпляр класс BasketView;
- modalElement: HTMLElement (private) - ссылка на элемент модального окна;
  (на данный момент в файле src/pages/index.html нет уникального идентификатора для этого элемента)

Методы:
- open(orderSubmitCallback: () => void, contactsSubmitCallback: () => void, successSubmitCallback: () => void): void (public) - осуществляет показ модального окна modalElement и запускает OrderView.render
- close(): void (public) - осуществляет скрытие модального окна modalElement
- addCloseEventListener(): void (private) - добавляет слушатель click для кнопки закрыть в modalElement. Запускается в конструкторе после устанорки значения для modalElement,

##### OrderView:
Класс представления. Создается в OrderModalView.

В конструкторе происходит установка всех полей класса, кроме parentElement

Поля:
- parentElement: HTMLElement (private) - ссылка на OrderModalView.modalElement устанавливается в методе render
- validation: OrderValidation (private) - экземпляр класса OrderValidation
- orderView: OrderOrderView (private) - представление перого шага формы;
- contactsView: OrderContactsView (private) - представление второго шага формы;
- successView: OrderSuccessView (private) - представление шага формы об успешной оплате;

Методы:
- render(parentElement: HTMLElement, orderSubmitCallback: () => void, contactsSubmitCallback: () => void, successSubmitCallback: () => void): void (public) - в методе описана логика
  установки поле submitCallback для всех дочерних представлений (для каждого submitCallback делаем дополнительную обертку из стрелочной функции, в которой запускаем метод render идущего дальше класса представления), добавления первого шага формы - orderView.render в parentElement.

##### OrderOrderView:
Класс представления. Создается в OrderView.

Поля конструктора: 
- validation: OrderValidation

В конструкторе происходит установка всех полей класса, кроме submitCallback

Поля:
- orderTemplateElement: HTMLElement (private) - ссылка на шаблон корзины, "#order";
- validation: OrderValidation (private) - экземпляр класса OrderValidation
- submitCallback: (formData: Partial<OrderApiRequestModel>) => void (public) - поле для хранения callback метода, переданного из презентера для связи модели и предсавления

Методы:
- render(parentElement: HTMLElement): void (public) - в методе описана логика
  добавления валидации к полям формы, добавления слушател на клик по кнопке submit,
- drop(parentElement: HTMLElement): void (public) - удаление отрендеренного шаблона из родительского элемента
- addClickOnSubmitButtonEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по кнопке 'Далее', с последующим запуском submitCallback. В данном методе мы собираем данные из полей формы и передаем их параметром в submitCallback

##### OrderContactsView:
Класс представления. Создается в OrderView.

Поля конструктора:
- validation: OrderValidation

В конструкторе происходит установка всех полей класса, кроме submitCallback

Поля:
- contactsTemplateElement: HTMLElement (private) - ссылка на шаблон корзины, "#contacts";
- validation: OrderValidation (private) - экземпляр класса OrderValidation
- submitCallback: (formData: Partial<OrderApiRequestModel>) => void (public) - поле для хранения callback метода, переданного из презентера для связи модели и предсавления

Методы:
- render(parentElement: HTMLElement): void (public) - в методе описана логика
  добавления валидации к полям формы, добавления слушател на клик по кнопке submit,
- drop(parentElement: HTMLElement): void (public) - удаление отрендеренного шаблона из родительского элемента
- addClickOnSubmitButtonEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по кнопке 'Оплатить', с последующим запуском submitCallback. В данном методе мы собираем данные из полей формы и передаем их параметром в submitCallback

##### OrderSuccessView:
Класс представления. Создается в OrderView.

В конструкторе происходит установка всех полей класса, кроме submitCallback

Поля:
- successTemplateElement: HTMLElement (private) - ссылка на шаблон корзины, "#success";
- submitCallback: () => void (public) - поле для хранения callback метода, переданного из презентера для связи модели и предсавления

Методы:
- render(cardData: ProductApiModel, parentElement: HTMLElement, removeItemCallback: () => void, goToOrderCallback: () => void): void (public) - в методе описана логика
  добавления карточки товара в parentElement. Для каждой карточки добавляем data-id со зачением ID продукта
- addClickOnSubmitButtonEventListener(callback: () => void): void (private) - В методе добавляется eventListener на клик по кнопке 'За новыми покупками', с последующим запуском submitCallback

##### OrderPresenter:
Представляет собой класс который осуществляет взаимодействие между View и Model. Создается при инициализации приложения в Order.

Параметры конструктора:
- views: {order: OrderModalView} -  объект с представлениями,
- models: {order: OrderModel} - объект с моделями,
- globals: {events: EventBus, state: GlobalState} - объект с глобальными частями системы

Поля:
- orderView: OrderView (private)
- orderModel: BasketModel (private)
- events: EventBus (private)
- state: GlobalState (private)

Поля заполняются в конструкторе из соответствующих параметров.

Методы:
- init(): void (public) - В методе происходит инициализация блока заказа, подписка на событие createOrderEvent где мы запускаем orderView.open и частично обновляем модель из данных пришедших в событиии (список Id товаров).
- onOrderSubmit(data: Partial<OrderApiRequestModel>): void (private) — callback, в методе частично обновляем модель orderModel из параметра data
- onContactsSubmit(data: Partial<OrderApiRequestModel>, callback: () => void): void (private) — callback, в методе частично обновляем модель orderModel из параметра data, запускаем запрос на сохранение даннных заказ orderModel.sentOrder и после ответа запускаем 
- onSuccessSubmit(): void (private) — callback, в этом методе посылаем событие clearBasket и orderView.close

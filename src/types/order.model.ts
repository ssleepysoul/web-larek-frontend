// Интерфейс API-клиента

import { ProductId } from './products.model';

export interface OrderApiResponseModel {
	id: string;
	total: number;
}

export enum OrderPaymentType {
	online = 'online',
	offline = 'offline',
}

export interface OrderApiRequestModel {
	payment: OrderPaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: ProductId[];
}


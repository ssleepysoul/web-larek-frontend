// Интерфейс API-клиента

import { ProductId } from './products.model';

export interface OrderApiResponseSuccessModel {
	id: string;
	total: number;
}

export interface OrderApiResponseErrorModel {
	error: string;
}

export enum OrderPaymentType {
	online = 'online',
	offline = 'offline',
}

export interface OrderApiRequestModel {
	payment: OrderPaymentType | null;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: ProductId[];
}


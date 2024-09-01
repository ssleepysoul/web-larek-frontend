// Интерфейс API-клиента

export type ProductId = string;

export interface ProductApiModel {
	id:	ProductId;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
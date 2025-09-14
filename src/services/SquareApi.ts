import api from '@/utils/axios';

export interface ProcessPaymentBody {
	order_id?: number;
	amount: number;
	currency?: string;
	payment_id?: string;
	status?: string;
	payment_method?: string;
	location_id?: string;
}

export interface AddCardBody {
	token: string;
	card_data?: {
		brand?: string;
		last4?: string;
		expMonth?: string | number;
		expYear?: string | number;
	};
	set_as_default?: boolean;
}

class SquareApi {
	async processPayment(body: ProcessPaymentBody) {
		const location = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_ID || '';
		const payload: ProcessPaymentBody = {
			payment_method: body.payment_method || 'square',
			location_id: body.location_id || location,
			...body,
		};
		const res = await api.post('/square/payment/process', payload);
		return res.data;
	}

	async addCustomerCard(body: AddCardBody) {
		const payload: AddCardBody = {
			...body,
			card_data: body.card_data ? {
				...body.card_data,
				expMonth: body.card_data.expMonth !== undefined ? String(body.card_data.expMonth) : undefined,
				expYear: body.card_data.expYear !== undefined ? String(body.card_data.expYear) : undefined,
			} : undefined,
		};
		const res = await api.post('/square/customer/add-card', payload);
		return res.data;
	}

	async getCustomerCards() {
		const res = await api.get('/square/customer/cards');
		return res.data;
	}
}

const squareApi = new SquareApi();
export default squareApi; 
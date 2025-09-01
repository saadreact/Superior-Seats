declare module 'squareup' {
  export enum Environment {
    Sandbox = 'sandbox',
    Production = 'production'
  }

  export interface ClientConfig {
    accessToken: string;
    environment: Environment;
  }

  export interface Money {
    amount: number;
    currency: string;
  }

  export interface Address {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  }

  export interface CreatePaymentRequest {
    sourceId: string;
    idempotencyKey: string;
    amountMoney: Money;
    locationId: string;
    buyerEmailAddress?: string;
    billingAddress?: Address;
  }

  export interface Payment {
    id?: string;
    status?: string;
  }

  export interface ApiResponse<T> {
    result: T;
  }

  export interface PaymentsApi {
    createPayment(request: CreatePaymentRequest): Promise<ApiResponse<{ payment?: Payment }>>;
    getPayment(paymentId: string): Promise<ApiResponse<{ payment?: Payment }>>;
    listPayments(request?: any): Promise<ApiResponse<{ payments?: Payment[] }>>;
  }

  export class Client {
    constructor(config: ClientConfig);
    paymentsApi: PaymentsApi;
  }
}

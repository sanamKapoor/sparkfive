export interface InvoiceStatusTransition {
  finalized_at: number;
  marked_uncollectible_at: null | number;
  paid_at: number;
  voided_at: null | number;
}

export interface Invoice {
  amount: number;
  statusTransitions: InvoiceStatusTransition;
  status: string;
  currency: string;
  invoicePdf: string;
  product: string; //TODO: can be restricted further
}

export interface IUpcomingInvoice {
  productId: string;
  product: string;
  amount: number;
  date: number;
  currency: string;
}

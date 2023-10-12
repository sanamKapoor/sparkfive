import { IUpcomingInvoice, Invoice } from "../interfaces/account/invoice";

const getInvoiceDate = (invoice: Invoice) => {
  if (invoice.status === "paid") {
    return (
      (!isNaN(invoice.statusTransitions.paid_at) &&
        new Date(invoice.statusTransitions.paid_at * 1000)) ||
      ""
    );
  } else {
    return new Date(invoice.statusTransitions.finalized_at * 1000);
  }
};

const getInvoiceStatus = (invoice: Invoice) => {
  if (invoice.status === "open") {
    return "in process";
  } else return invoice.status;
};

export const getParsedInvoices = (invoices: Invoice[]) =>
  invoices
    .filter(
      ({ product, status, statusTransitions }) =>
        product !== process.env.STRIPE_EXPIRE_PRODUCT_NAME &&
        (status !== "draft" || statusTransitions.finalized_at)
    )
    .map((invoice) => ({
      ...invoice,
      date: getInvoiceDate(invoice),
      status: getInvoiceStatus(invoice),
    }));

export const getParsedUpcomingInvoices = (invoices: IUpcomingInvoice[]) =>
  invoices
    .filter(({ product }) => product !== process.env.STRIPE_EXPIRE_PRODUCT_NAME)
    .map((upcoming) => ({ ...upcoming, date: new Date(upcoming.date * 1000) }));

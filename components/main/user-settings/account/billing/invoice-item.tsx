import { format } from "date-fns";
import downloadUtils from "../../../../../utils/download";
import styles from "./invoice-item.module.css";

// Components
import { capitalCase } from "change-case";
import { AssetOps } from "../../../../../assets";
import { formatAmount } from "../../../../../utils/numbers";
import IconClickable from "../../../../common/buttons/icon-clickable";

interface InvoiceItemProps {
  invoice: any;
  type?: string;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  type = "invoice",
}) => {
  const downloadInvoice = () => {
    downloadUtils.downloadFile(invoice.invoicePdf);
  };

  return (
    <div className={styles.container}>
      <div>{invoice.date && format(invoice.date, "MM/dd/yyyy")}</div>
      <div>{invoice.product}</div>
      {type === "invoice" && <div>{capitalCase(invoice.status)}</div>}
      <div>{formatAmount(invoice.amount, invoice.currency)}</div>
      {type === "invoice" && (
        <IconClickable src={AssetOps.download} onClick={downloadInvoice} />
      )}
    </div>
  );
};

export default InvoiceItem;

import { format } from "date-fns";
import downloadUtils from "../../../../../utils/download";
import { formatCurrency } from "../../../../../utils/numbers";
import styles from "./invoice-item.module.css";

// Components
import { capitalCase } from "change-case";
import { AssetOps } from "../../../../../assets";
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
      <div>{formatCurrency(invoice.amount / 100)}</div>
      {type === "invoice" && (
        <IconClickable src={AssetOps.download} onClick={downloadInvoice} />
      )}
    </div>
  );
};

export default InvoiceItem;

import styles from './invoice-item.module.css'
import { format } from 'date-fns'
import { formatCurrency } from '../../../../../utils/numbers'
import downloadUtils from '../../../../../utils/download'

// Components
import Tag from '../../../../common/misc/tag'
import IconClickable from '../../../../common/buttons/icon-clickable'
import { AssetOps } from '../../../../../assets'
import { capitalCase } from 'change-case'

const InvoiceItem = ({ invoice, type = 'invoice' }) => {
  const downloadInvoice = () => {
    downloadUtils.downloadFile(invoice.invoicePdf)
  }

  return (
    <div className={styles.container}>
      <div>
        {invoice.date && format(invoice.date, 'MM/dd/yyyy')}
      </div>
      <div>
        {invoice.product}
      </div>
      {type === 'invoice' && <div>{capitalCase(invoice.status)}</div>}
      <div>
        {formatCurrency(invoice.amount / 100)}
      </div>
      {type === 'invoice' &&
        <IconClickable
          src={AssetOps.download}
          onClick={downloadInvoice}
        />
      }
    </div>
  )
}

export default InvoiceItem
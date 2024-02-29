import { useEffect, useState } from "react";
import planApi from "../../../../../server-api/plan";
import styles from "./invoices.module.css";

// Components
import {
  getParsedInvoices,
  getParsedUpcomingInvoices,
} from "../../../../../utils/invoices";
import InvoiceItem from "./invoice-item";
import Headers from "./invoices-headers";

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [upcomingInvoices, setUpcomingInvoices] = useState([]);

  //TODO: implement/ remove as per requirement
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    getInvoices();
    getUpcoming();
  }, []);

  const getInvoices = async () => {
    try {
      const {
        data: { hasMore, invoices },
      } = await planApi.getInvoices();
      setHasMore(hasMore);
      setInvoices(invoices);
    } catch (err) {
      console.log(err);
    }
  };

  const getUpcoming = async () => {
    try {
      const { data } = await planApi.getUpcomingInvoice();
      setUpcomingInvoices([data]);
    } catch (err) {
      console.log(err);
    }
  };

  const parsedInvoices = getParsedInvoices(invoices);
  const parsedUpcomingInvoices = getParsedUpcomingInvoices(upcomingInvoices);

  return (
    <div>
      {invoices.length > 0 ? (
        <ul>
          <Headers />
          {parsedInvoices.map((invoice, index) => (
            <li key={index}>
              <InvoiceItem invoice={invoice} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No invoices available</p>
      )}
      {upcomingInvoices.length > 0 && (
        <>
          <h3 className={styles["upcoming-header"]}>Upcoming Charges</h3>
          <ul>
            <Headers type="upcoming" />
            {parsedUpcomingInvoices.map((invoice, index) => (
              <li key={index}>
                <InvoiceItem invoice={invoice} type="upcoming" />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Invoices;

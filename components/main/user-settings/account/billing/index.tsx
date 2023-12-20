import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { capitalCase } from "change-case";
import { useEffect, useState } from "react";

import planApi from "../../../../../server-api/plan";
import styles from "./index.module.css";

import { IPaymentMethod } from "../../../../../interfaces/account/payment";
import { BillingTabs } from "../../../../../interfaces/common/tabs";
import Invoices from "./invoices";
import PaymentMethod from "./payment-method";
import Subscription from "./subscription";
import useAnalytics from "../../../../../hooks/useAnalytics";
import { pages } from "../../../../../constants/analytics";

const SETTING_SECTIONS_CONTENT = {
  subscription: Subscription,
  invoices: Invoices,
  paymentMethod: PaymentMethod,
};

const SectionButtonOption = ({ section, activeSection, setActiveSection }) => (
  <div
    className={`${styles["section-button"]} ${
      activeSection === section ? styles.active : ""
    }`}
    onClick={() => setActiveSection(section)}
  >
    {capitalCase(section)}
  </div>
);

const Billing = () => {
  const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
  const [activeSection, setActiveSection] = useState<BillingTabs>(
    BillingTabs.SUBSCRIPTION
  );
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>(undefined);
  const ActiveContent = SETTING_SECTIONS_CONTENT[activeSection];

  useEffect(() => {
    getPaymentMethod();
  }, []);

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.BILLING)
  },[]);

  const getPaymentMethod = async () => {
    try {
      const { data } = await planApi.getPaymentMethod();
      setPaymentMethod(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["section-buttons"]}>
        <SectionButtonOption
          section={BillingTabs.SUBSCRIPTION}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <SectionButtonOption
          section={BillingTabs.INVOICES}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <SectionButtonOption
          section={BillingTabs.PAYMENT_METHOD}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>
      <Elements stripe={stripePromise}>
        <div className={styles.content}>
          <ActiveContent
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            getPaymentMethod={getPaymentMethod}
          />
        </div>
      </Elements>
    </div>
  );
};

export default Billing;

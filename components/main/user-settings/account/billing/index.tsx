import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { capitalCase } from "change-case";
import { useEffect, useState } from "react";

import planApi from "../../../../../server-api/plan";
import styles from "./index.module.css";

import Invoices from "./invoices";
import PaymentMethod from "./payment-method";
import Subscription from "./subscription";

const SETTING_SECTIONS_CONTENT = {
  subscription: Subscription,
  invoices: Invoices,
  paymentMethod: PaymentMethod,
};

const Billing = () => {
  const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
  const [activeSection, setActiveSection] = useState("subscription");
  const [paymentMethod, setPaymentMethod] = useState(undefined);
  const ActiveContent = SETTING_SECTIONS_CONTENT[activeSection];

  useEffect(() => {
    getPaymentMethod();
  }, []);

  const getPaymentMethod = async () => {
    try {
      const { data } = await planApi.getPaymentMethod();
      setPaymentMethod(data);
    } catch (err) {
      console.log(err);
    }
  };

  const SectionButtonOption = ({ section }) => (
    <div
      className={`${styles["section-button"]} ${
        activeSection === section ? styles.active : ""
      }`}
      onClick={() => setActiveSection(section)}
    >
      {capitalCase(section)}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles["section-buttons"]}>
        <SectionButtonOption section="subscription" />
        <SectionButtonOption section="invoices" />
        <SectionButtonOption section="paymentMethod" />
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

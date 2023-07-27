import { differenceInDays, format } from "date-fns";
import { useContext, useState } from "react";
import { TeamContext } from "../../../../../context";
import planApi from "../../../../../server-api/plan";
import { formatCurrency } from "../../../../../utils/numbers";
import toastUtils from "../../../../../utils/toast";
import styles from "./subscription-plan.module.css";

// Components
import BaseModal from "../../../../common/modals/base";

const SubscriptionData = ({ label, value }) => (
  <div className={styles.item}>
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

const SubscriptionPlan = ({ paymentMethod, goCheckout }) => {
  const { plan } = useContext(TeamContext);

  const [cancelOpen, setCancelOpen] = useState(false);

  const getFrequency = () => {
    if (plan) {
      const { interval } = plan.stripePrice;
      if (interval === "month") return "Monthly";
      else return "Annual";
    }
  };

  const getAmount = () => {
    if (plan) {
      return formatCurrency(plan.stripePrice.amount / 100);
    }
  };

  const cancelPlan = async () => {
    try {
      await planApi.cancelPlan();
      toastUtils.success(
        `Plan canceled. You won't be billed at the end of your current period.`
      );
      setCancelOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  let productName = plan?.stripeProduct.name;
  if (plan?.status === "trialing") {
    const remainingDays = differenceInDays(new Date(plan.endDate), new Date());
    productName += ` (Trial - ${remainingDays} day(s) remaining)`;
  }

  return (
    <div className={styles.container}>
      {plan && (
        <div className={styles["sub-container"]}>
          <div className={"fields-first"}>
            <div className={styles.plan}>
              <SubscriptionData label={"Plan Name"} value={productName} />
              <SubscriptionData label={"Frequency"} value={getFrequency()} />
              <SubscriptionData label={"Amount"} value={getAmount()} />
              <SubscriptionData
                label={"Start Date"}
                value={format(new Date(plan.startDate), "MM/dd/yyyy")}
              />
              <SubscriptionData
                label={"Renewal Date"}
                value={format(new Date(plan.endDate), "MM/dd/yyyy")}
              />
            </div>
          </div>
          <div className={styles.storage}>
            <h3>Account Storage Used</h3>
            <div className={styles.bar_wrapper}>
              <div className={styles.bar}>
                {/* TO DO: the width style should em dynamic accourding to percentage */}
                <div className={styles.bar_used} style={{ width: "65%" }}></div>
              </div>
              <span>65%</span>
            </div>
            <div className={styles.storage_info}>500 GB out 1TB used</div>
          </div>
        </div>
      )}
      <BaseModal
        closeModal={() => setCancelOpen(false)}
        modalIsOpen={cancelOpen}
        headText={"Are you sure you want to cancel your plan?"}
        confirmAction={cancelPlan}
        confirmText={"Cancel plan"}
      ></BaseModal>
    </div>
  );
};

export default SubscriptionPlan;

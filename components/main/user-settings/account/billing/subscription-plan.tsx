import { differenceInDays, format } from "date-fns";
import { useContext, useState } from "react";
import { TeamContext, UserContext } from "../../../../../context";
import planApi from "../../../../../server-api/plan";
import { formatCurrency } from "../../../../../utils/numbers";
import toastUtils from "../../../../../utils/toast";
import styles from "./subscription-plan.module.css";

// Components
import {
  calculateStorageUsedPercent,
  formatBytes,
} from "../../../../../utils/upload";
import BaseModal from "../../../../common/modals/base";

interface SubscriptionDataProps {
  label: string;
  value: string;
}

const SubscriptionData: React.FC<SubscriptionDataProps> = ({
  label,
  value,
}) => (
  <div className={styles.item}>
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

const SubscriptionPlan: React.FC = () => {
  const { plan } = useContext(TeamContext);
  const { user } = useContext(UserContext);

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

  const getStorageUsed = () => {
    return formatBytes(parseInt(user?.storageUsed || 0));
  };

  const formattedStorageUsed = getStorageUsed();
  const totalStorage = plan?.benefit?.storage;

  const percent = plan
    ? calculateStorageUsedPercent(user?.storageUsed || 0, totalStorage)
    : 0;

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
                <div
                  className={styles.bar_used}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span>{percent}%</span>
            </div>
            <div className={styles.storage_info}>
              {formattedStorageUsed} out of {totalStorage} used
            </div>
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

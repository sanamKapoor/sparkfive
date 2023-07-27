import { useContext, useEffect, useState } from "react";
import { TeamContext } from "../../../../context";
import planApi from "../../../../server-api/plan";
import toastUtils from "../../../../utils/toast";
import constants from "./constants";
import styles from "./index.module.css";

// Components
import SectionButton from "../../../common/buttons/section-button";
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";
import DataUsage from "../../../common/usage/data-usage";
import PlanCard from "./plan-card";
import PlanChangeModal from "./plan-change-modal";

const Plan = () => {
  const [activeCycle, setActiveCycle] = useState("annual");
  const [activeType, setActiveType] = useState("marketing_hub");
  const [productData, setProductData] = useState(undefined);

  const [selectedPlan, setSelectedPlan] = useState(undefined);
  const [paymentMethod, setPaymentMethod] = useState(undefined);

  const { getPlan, plan } = useContext(TeamContext);

  useEffect(() => {
    getBillingInfo();
    getPaymentMethod();
  }, []);

  useEffect(() => {
    if (plan) setActiveType(plan.type);
  }, [plan]);

  const getBillingInfo = async () => {
    try {
      const { data } = await planApi.getAvailableProducts();
      setProductData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getPaymentMethod = async () => {
    try {
      const { data } = await planApi.getPaymentMethod();
      setPaymentMethod(data);
    } catch (err) {
      console.log(err);
    }
  };

  const openChangeModal = (price) => {
    setSelectedPlan(price);
  };

  const redirectToContact = () => {
    // Empty function for now
  };

  const confirmPlanChange = async () => {
    try {
      await planApi.changePlan({
        priceId: selectedPlan.id,
        subProrationDate: selectedPlan.invoicePreview.prorationDate,
      });
      setSelectedPlan(null);
      await getPlan({ withStorageUsage: true });
      toastUtils.success("Plan changed succesfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      {(!plan || !productData) && <SpinnerOverlay />}
      {plan && (
        <>
          <div className={styles.usage}>
            <h3>Data Usage</h3>
            <DataUsage
              limit={plan.benefit.storage}
              limitBytes={plan.storageLimitBytes}
              usage={plan.storageUsage}
            />
          </div>
          <div className={styles["section-buttons-type"]}>
            <SectionButton
              text="DAM"
              onClick={() => setActiveType("dam")}
              active={activeType === "dam"}
            />
            <SectionButton
              text="Marketing Hub"
              onClick={() => setActiveType("marketing_hub")}
              active={activeType === "marketing_hub"}
            />
          </div>
          <div className={styles["section-buttons-cycle"]}>
            <SectionButton
              text="Annual"
              onClick={() => setActiveCycle("annual")}
              active={activeCycle === "annual"}
            />
            <SectionButton
              text="Monthly"
              onClick={() => setActiveCycle("monthly")}
              active={activeCycle === "monthly"}
            />
          </div>
          <ul className={styles.products}>
            {productData &&
              [
                ...productData[activeCycle].filter(
                  ({ metadata: { type } }) => type === activeType
                ),
                constants.ENTERPRISE_PLAN,
              ].map((price) => {
                let buttonText = "Upgrade";
                if (price.id === plan.stripePriceId) {
                  buttonText = "Current Plan";
                } else if (price.amount < plan.stripePrice.amount) {
                  buttonText = "Downgrade";
                }
                return (
                  <li key={price.id}>
                    <PlanCard
                      {...price}
                      onChange={
                        price.type !== "enterprise"
                          ? () => openChangeModal(price)
                          : redirectToContact
                      }
                      buttonDisabled={price.id === plan.stripePriceId}
                      buttonText={buttonText}
                      activeType={activeType}
                      paymentMethodExists={paymentMethod}
                    />
                  </li>
                );
              })}
          </ul>
        </>
      )}
      <PlanChangeModal
        selectedPlan={selectedPlan}
        confirmPlanChange={confirmPlanChange}
        setSelectedPlan={setSelectedPlan}
      />
    </div>
  );
};

export default Plan;

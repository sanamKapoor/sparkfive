import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useEffect, useState } from "react";
import { TeamContext } from "../../../../../context";
import planApi from "../../../../../server-api/plan";
import toastUtils from "../../../../../utils/toast";
import styles from "./subscription-checkout.module.css";

// Components
import CreditCardForm from "../../../../common/payment/credit-card-form";
import SubscriptionSummary from "../../../../common/payment/subscription-summary";

const stripePromise = loadStripe("pk_test_bK1C20PBomU24spmlMeg4AXp");

interface SubscriptionCheckoutProps {
  goBack: () => void;
  checkoutProduct: any;
}

const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({
  goBack,
  checkoutProduct,
}) => {
  const [productData, setProductData] = useState(undefined);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const { getPlan } = useContext(TeamContext);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    try {
      const { data } = await planApi.getAvailableProducts();
      setProductData(data);
    } catch (err) {
      // TODO: Handle error
      console.log(err);
    }
  };

  const subscribe = async (paymentMethodId) => {
    try {
      await planApi.changePlan({ priceId: selectedPrice.id, paymentMethodId });
      getPlan({ withStorageUsage: true });
      goBack();
      toastUtils.success("Plan changed successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={`${styles.container} container-centered`}>
      {productData && (
        <div>
          <SubscriptionSummary
            productData={productData}
            setSelectedPrice={setSelectedPrice}
            selectedPrice={selectedPrice}
            checkoutProduct={checkoutProduct}
          />
          <Elements stripe={stripePromise}>
            <CreditCardForm
              onConfirm={subscribe}
              buttonDisabled={!selectedPrice}
            />
          </Elements>
        </div>
      )}
    </main>
  );
};

export default SubscriptionCheckout;

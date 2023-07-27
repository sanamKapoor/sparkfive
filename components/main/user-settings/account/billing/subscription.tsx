import { useContext, useState } from "react";
import { TeamContext } from "../../../../../context";

// Components
import SubscriptionCheckout from "./subscription-checkout";
import SubscriptionPlan from "./subscription-plan";

const Subscription = ({ paymentMethod, getPaymentMethod }) => {
  const { plan } = useContext(TeamContext);
  const [onCheckout, setOnCheckout] = useState(false);

  const goBack = () => {
    getPaymentMethod();
    setOnCheckout(false);
  };

  return (
    <div>
      {!onCheckout ? (
        <SubscriptionPlan
          goCheckout={() => setOnCheckout(true)}
          paymentMethod={paymentMethod}
        />
      ) : (
        <SubscriptionCheckout
          goBack={goBack}
          checkoutProduct={plan?.stripeProduct?.id}
        />
      )}
    </div>
  );
};

export default Subscription;

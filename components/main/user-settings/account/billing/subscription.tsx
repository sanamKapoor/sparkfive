import { useContext, useState } from "react";
import { TeamContext } from "../../../../../context";

// Components
import SubscriptionCheckout from "./subscription-checkout";
import SubscriptionPlan from "./subscription-plan";

interface SubscriptionProps {
  getPaymentMethod: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ getPaymentMethod }) => {
  const { plan } = useContext(TeamContext);
  const [onCheckout, setOnCheckout] = useState(false);

  const goBack = () => {
    getPaymentMethod();
    setOnCheckout(false);
  };

  return (
    <div>
      {!onCheckout ? (
        <SubscriptionPlan />
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

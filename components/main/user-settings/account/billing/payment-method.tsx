import styles from "./payment-method.module.css";

import { useState } from "react";
import planApi from "../../../../../server-api/plan";

// Components
import { IPaymentMethod } from "../../../../../interfaces/account/payment";
import Button from "../../../../common/buttons/button";
import BaseModal from "../../../../common/modals/base";
import CreditCardForm from "../../../../common/payment/credit-card-form";

interface PaymentMethodProps {
  paymentMethod: IPaymentMethod;
  setPaymentMethod: (val: IPaymentMethod) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  const [modalActive, setModalActive] = useState(false);

  const updatePaymentMethod = async (paymentMethodId) => {
    try {
      const { data } = await planApi.addPaymentMethod({ paymentMethodId });
      setPaymentMethod(data);
    } catch (err) {
      console.log(err);
    } finally {
      setModalActive(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Active Card</h3>
        <div className={`${styles["card-info"]}`}>
          {paymentMethod ? (
            <div>
              <div>{paymentMethod.name}</div>
              <div>{`${paymentMethod.brand} ending in ${paymentMethod.last4}`}</div>
              <div>{`Expires ${paymentMethod.expMonth}/${paymentMethod.expYear} `}</div>
            </div>
          ) : (
            <div className={"fields-first"}>No card configured</div>
          )}
          <div>
            <Button
              text="Update Card"
              type="button"
              onClick={() => setModalActive(true)}
              className="container primary"
            />
          </div>
        </div>
      </div>
      <BaseModal
        headText="Update Credit Card"
        subText="Please enter your credit card details below"
        closeModal={() => setModalActive(false)}
        noHeightMax={true}
        additionalClasses={["visible-block"]}
        modalIsOpen={modalActive}
      >
        <CreditCardForm
          onConfirm={updatePaymentMethod}
          buttonText={"Update Card"}
          buttonDisabled={false}
          noBottomMargin={true}
        />
      </BaseModal>
    </>
  );
};

export default PaymentMethod;

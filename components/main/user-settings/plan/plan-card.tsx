import { formatCurrency } from "../../../../utils/numbers";
import featuresConstants from "./constants";
import styles from "./plan-card.module.css";

// Components
import Button from "../../../common/buttons/button";

const PlanCard = ({
  type,
  id,
  product,
  currency,
  amount,
  interval,
  name,
  metadata,
  onChange = (priceId) => {},
  buttonDisabled,
  buttonText,
  paymentMethodExists = false,
  activeType,
}) => {
  let monthValue = amount / 100;
  if (interval === "year") {
    monthValue = amount / 100 / 12;
  }

  const ChangeButton = () => (
    <Button
      text={buttonText}
      type="button"
      disabled={buttonDisabled}
      onClick={onChange}
      className="container primary"
    />
  );

  let summary;
  let features;

  if (activeType === "dam") {
    summary = featuresConstants[`DAM_${metadata.benefits_id}_SUMMARY`];
    features = featuresConstants[`DAM_${metadata.benefits_id}_FEATURES`];
  } else {
    summary = featuresConstants[`${metadata.benefits_id}_SUMMARY`];
    features = featuresConstants[`${metadata.benefits_id}_FEATURES`];
  }

  return (
    <div className={styles.container}>
      <h3>{name.toUpperCase()}</h3>
      <p className={styles.description}>{summary}</p>
      <div className={styles.pricing}>
        {type === "enterprise" ? (
          <div className={styles.contact}>Contact Us</div>
        ) : (
          <>
            <div className={styles.monthly}>
              <div>{formatCurrency(monthValue)}</div>
              <div>month</div>
            </div>
            {interval === "year" && (
              <div className={styles.anual}>{`billed ${formatCurrency(
                amount / 100
              )} anually`}</div>
            )}
          </>
        )}
      </div>
      <div className={styles["key-header"]}>Key Features:</div>
      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature}>
            <div>✔</div>
            <div>{feature}</div>
          </li>
        ))}
      </ul>
      {paymentMethodExists || type === "enterprise" ? (
        <>
          {type === "enterprise" ? (
            <a href="mailto:sales@sparkfive.com">
              <ChangeButton />
            </a>
          ) : (
            <ChangeButton />
          )}
        </>
      ) : (
        <div className={styles["please-add"]}>Please add a Payment method</div>
      )}
    </div>
  );
};

export default PlanCard;

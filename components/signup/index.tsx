import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../context";
import billingApi from "../../server-api/billing";
import urlUtils from "../../utils/url";
import styles from "./index.module.css";

// Components
import AuthContainer from "../common/containers/auth-container";
import SignupForm from "./signup-form";

const Signup = ({ onlyWorkEmail = false }) => {
  const { query } = useRouter();

  const [shareInviteCode, setShareInviteCode] = useState(undefined);
  const [priceData, setPriceData] = useState(undefined);
  const [defaultEmail, setDefaultEmail] = useState("");
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const { inviteCode, email } = urlUtils.getQueryParameters();
    if (inviteCode) {
      setShareInviteCode(inviteCode);
    }

    if (email) {
      setDefaultEmail(email as string);
    }

    if (!inviteCode) {
      const { priceId } = urlUtils.getQueryParameters();
      if (priceId) {
        getPlaData(priceId as string);
      } else {
        getPlaData();
      }
    }
  }, []);

  const getPlaData = async (
    priceId = process.env.STRIPE_DEFAULT_SIGNUP_PRICE
  ) => {
    try {
      setIsLoading(true);
      const { data } = await billingApi.getPriceById(priceId);
      setPriceData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`${styles.container} container-centered`}>
      <AuthContainer
        title={
          query.inviteCode
            ? "Get started with Sparkfive today"
            : "Get started for FREE today"
        }
        subtitle={
          query.inviteCode ? "" : "No credit card required - 14 day free trial"
        }
      >
        <SignupForm
          inviteCode={shareInviteCode}
          priceData={priceData}
          email={defaultEmail}
          onlyWorkEmail={onlyWorkEmail}
        />
      </AuthContainer>
      {!shareInviteCode && (
        <p className="nav-text">
          Already have an account?{" "}
          <Link href="/login">
            <span>Log In</span>
          </Link>
        </p>
      )}
    </main>
  );
};

export default Signup;

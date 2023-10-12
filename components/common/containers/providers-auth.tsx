import styles from "./providers-auth.module.css";

import authApi from "../../../server-api/auth";
import cookiesUtil from "../../../utils/cookies";

// Components

let ProvidersAuth = ({ inviteCode = "", priceData }) => {
  const initiateOAuth = async (provider) => {
    try {
      const { data } = await authApi.getUrl(provider);
      cookiesUtil.set("oauthProvider", provider);
      cookiesUtil.set("inviteCode", inviteCode);
      cookiesUtil.set("signupPrice", priceData?.priceId);
      window.location.replace(data.url);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <a
          className={styles.ssolink}
          href="#"
          onClick={() => initiateOAuth("oauth")}
        >
          or login with SSO
        </a>
      </div>
    </div>
  );
};

export default ProvidersAuth;

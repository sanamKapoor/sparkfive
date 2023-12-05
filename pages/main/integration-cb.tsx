import Router from "next/router";
import { useEffect } from "react";
import userApi from "../../server-api/user";
import cookiesUtil from "../../utils/cookies";
import toastUtils from "../../utils/toast";
import urlUtils from "../../utils/url";
import useAnalytics from "../../hooks/useAnalytics";
import { pages } from "../../constants/analytics";

// Simple redirect page
const OauthCbPage = () => {
  useEffect(() => {
    // TODO: Include state string verification
    const { code } = urlUtils.getQueryParameters();
    addIntegration(decodeURIComponent(code as string));
  }, []);

  const addIntegration = async (code) => {
    const type = cookiesUtil.get("integrationType");
    const onSetup = cookiesUtil.get("onSetup");
    try {
      await userApi.addIntegration({ code, type });
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not add integration, please try again later");
    } finally {
      let redirectUrl;
      if (onSetup) redirectUrl = "/main/setup?step=integrations";
      else redirectUrl = "/main/user-settings/integrations";

      Router.replace(redirectUrl);
    }
  };


  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.UPLOAD_APPROVAL)
},[]);

  return (
    <div className="container">
      {/* TODO: Replace with prettier loading indicator */}
      Loading...
    </div>
  );
};

export default OauthCbPage;

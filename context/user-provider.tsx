import Router, { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { LoadingContext, UserContext } from "../context";

import SpinnerOverlay from "../components/common/spinners/spinner-overlay";

import teamApi from "../server-api/team";
import userApi from "../server-api/user";

import advancedConfigParams from "../utils/advance-config-params";
import url from "../utils/url";
import cookiesUtils from "../utils/cookies";
import { getSubdomain } from "../utils/domain";
import requestsUtils from "../utils/requests";
import { loadTheme, resetTheme } from "../utils/theme";

import { defaultLogo } from "../constants/theme";
import { events } from '../constants/analytics';

import useAnalytics from '../hooks/useAnalytics';
import { defaultFaceRecognitionSettings } from "../constants/face-recognition";

const allowedBase = [
  "/signup",
  "trial-signup",
  "request-access",
  "/share",
  "/reset-password",
  "/forgot-password",
  "/two-factor",
  "/collections",
];

export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoadFinished, setInitialLoadFinished] = useState(false);
  const [waitToVerifyDomain, setWaitToVerifyDomain] = useState(false);
  const [vanityCompanyInfo, setVanityCompanyInfo] = useState();
  const [cdnAccess, setCdnAccess] = useState(false);
  const [transcriptAccess, setTranscriptAccess] = useState(false);
  const [advancedConfig, setAdvancedConfig] = useState(advancedConfigParams);
  const [faceRecognitionSettings, setFaceRecognitionSettings] = useState(defaultFaceRecognitionSettings);
  const [logo, setLogo] = useState<string>(defaultLogo);
  const [logoId, setLogoId] = useState<string>();

  const { trackEvent, identify } = useAnalytics();

  const { setIsLoading } = useContext(LoadingContext);

  const router = useRouter();

  const fetchUser = async (trackUser = false, redirectLogin = false) => {
    // Skip fetching user if on collections page
    if (Router.pathname.indexOf("/collections") !== -1) return;

    if (Router.pathname.indexOf("/guest-upload") !== -1) return;

    if (redirectLogin) return Router.replace("/login");
    const jwt = cookiesUtils.get("jwt");

    if (jwt) requestsUtils.setAuthToken(jwt);

    const needTwoFactor = cookiesUtils.get("twoFactor");

    cookiesUtils.remove("twoFactor");
    if (needTwoFactor && Router.pathname.indexOf("/two-factor") === -1) {
      return Router.replace("/two-factor");
    }

    if (jwt && !needTwoFactor) {
      try {
        setIsLoading(true);
        const query = url.getQueryStringFromObject(Router.query);

        const { data } = await userApi.getUserData();

        const teamResponse = await teamApi.getTeam();
        setCdnAccess(teamResponse.data.cdnAccess);
        setTranscriptAccess(teamResponse.data.transcript);

        setFaceRecognitionSettings({
          ...defaultFaceRecognitionSettings,
          ...(data.team?.teamRecognitionSettings || {}),
        });

        const { data: advOptions } = await teamApi.getAdvanceOptions();
        setAdvancedConfig({ ...advOptions, set: true });

        // Custom role will use custom permission here
        if (data.role.type === "custom") {
          data.permissions = data.role.permissions;
        }
        setUser(data);

        // If theme customization was turned on by admin
        if (teamResponse.data.themeCustomization) {
          // There is team theme set
          if (teamResponse.data.theme) {
            // Load theme from team settings
            const currentTheme = loadTheme(teamResponse.data.theme);

            setLogo(currentTheme.logoImage?.realUrl || defaultLogo);
            setLogoId(currentTheme.logoImage?.asset?.id);
          } else {
            // Load theme from local storage
            const currentTheme = loadTheme();
            setLogo(currentTheme.logo?.url || defaultLogo);
            setLogoId(currentTheme.logo?.id);
          }
        } else {
          resetTheme();
        }
        
        if(trackUser && data?.team && data?.team?.analytics){          
          // Track loggedIn user data for analytics
          identify({
            id: data.id,
            email: data.email,
            teamId: data.team.id
          });
        }

        if (!data.firstTimeLogin && Router.pathname.indexOf("/main/setup") === -1) {
          await Router.replace("/main/setup");
        } else if (Router.pathname.indexOf("/main") === -1) {
          if (data.team.plan.type === "dam") {
            await Router.replace("/main/assets" + (query === "" ? "" : `?${query}`));
          } else {
            await Router.replace("/main/overview");
          }
        } else if (
          data.firstTimeLogin &&
          data.team.plan.type === "dam" &&
          Router.pathname.indexOf("/user-settings") === -1 &&
          Router.pathname.indexOf("/advanced-options") !== -1 &&
          Router.pathname.indexOf("/deleted-assets-list") === -1
        ) {
          await Router.replace("/main/assets" + (query === "" ? "" : `?${query}`));
        }
      } catch (err) {
        console.log(err);
        initialRedirect();
      } finally {
        setIsLoading(false);
      }
    } else initialRedirect();
  };

  const initialRedirect = () => {
    if (!allowedBase.some((url) => Router.pathname.indexOf(url) !== -1)) {
      Router.replace("/login");
    }
  };

  const logOut = () => {
    // Reset Logo
    setLogo(defaultLogo);
    setLogoId(undefined);

    // Reset theme
    resetTheme();
    cookiesUtils.remove("jwt");
    cookiesUtils.remove("adminToken");
    requestsUtils.removeAuthToken();

    // Track the logout event and remove the userId
    trackEvent(events.LOGOUT, {
      id: user?.id,
      email: user?.email,
    });

    setUser(null);
    Router.replace("/login");
  };

  const resetLogo = () => {
    // Reset Logo
    setLogo(defaultLogo);
    setLogoId(undefined);
  };

  const hasPermission = (requiredPermissions = [], requiredTeamSettings = []) => {
    // console.warn(`Check permission: `, requiredPermissions, user?.permissions)
    if (requiredPermissions.length === 0 && requiredTeamSettings.length === 0) return true;
    // check by features/permissions
    let allowed = requiredPermissions.some((perm) => user?.permissions.map((userPerm) => userPerm.id).includes(perm));

    // check by roleId
    if (!allowed) {
      allowed = requiredPermissions.some((role) => user && role === user.roleId);
    }

    // Check by team settings
    if (requiredTeamSettings.length > 0) {
      allowed = requiredTeamSettings.some((setting) => user.team[setting]);
    }

    return allowed;
  };

  const afterAuth = async ({ twoFactor, token }) => {
    cookiesUtils.setUserJWT(token);
    if (twoFactor) {
      cookiesUtils.set("twoFactor", "true");
    }
    await fetchUser(true);
  };

  useEffect(() => {
    if (router.route) {
      getUserData();
    }
  }, [router.route]);

  const verifyDomain = async () => {
    const subdomain = getSubdomain();

    if (subdomain) {
      setWaitToVerifyDomain(true);

      try {
        const results = await teamApi.verifyDomain(subdomain);

        setVanityCompanyInfo(results.data);

        setWaitToVerifyDomain(false);
      } catch (e) {
        // Cant verify domain
        setWaitToVerifyDomain(false);

        router.replace(`${process.env.CLIENT_BASE_URL}/login`);
      }
    } else {
      setWaitToVerifyDomain(false);
    }
  };

  useEffect(() => {
    verifyDomain();
  }, []);

  const getUserData = async () => {
    await fetchUser();
    setInitialLoadFinished(true);
  };

  const userValue = {
    user,
    setUser,
    advancedConfig,
    setAdvancedConfig,
    fetchUser,
    logOut,
    hasPermission,
    initialLoadFinished,
    afterAuth,
    vanityCompanyInfo,
    cdnAccess,
    transcriptAccess,
    logo,
    setLogo,
    logoId,
    resetLogo,
    faceRecognitionSettings,
    setFaceRecognitionSettings,
  };

  return (
    <UserContext.Provider value={userValue}>
      <>
        {initialLoadFinished && children}
        {waitToVerifyDomain && <SpinnerOverlay />}
      </>
    </UserContext.Provider>
  );
};

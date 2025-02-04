import Head from "next/head";
// Import global css
import "emoji-mart/css/emoji-mart.css";
import "react-day-picker/lib/style.css";
import "react-input-range/lib/css/index.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../styles/auth.css";
import "../styles/billing-settings.css";
import "../styles/creatable-select.css";
import "../styles/detail-pages.css";
import "../styles/general.css";
import "../styles/grid.css";
import "../styles/input.css";
import "../styles/loading-skeleton.css";
import "../styles/overlays.css";
import "../styles/position.css";
import "../styles/progress.css";
import "../styles/schedule.css";
import "../styles/search.css";
import "../styles/select.css";
import "../styles/slick-slider.css";
import "../styles/slider.css";
import "../styles/text.css";
import "../styles/time-picker.css";
import "../styles/toast.css";
import "../styles/color-picker.css";
// Import stripe as a side effect so it helps detect fraudulent activy
import "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import dragndropPolyfill from "../polyfills/dragndroptouch";
// Contexts
import { LanguageContext, ThemeContext } from "../context";
import AssetContextProvider from "../context/asset-provider";
import LoadingContextProvider from "../context/loading-provider";
import ScheduleProvider from "../context/schedule-provider";
import ShareProvider from "../context/share-provider";
import SocketProvider from "../context/socket-provider";
import TeamContextProvider from "../context/team-provider";
import UserContextProvider from "../context/user-provider";
import ErrorBoundary from "./ErrorBoumdary"
// FB pixel
import FBPixel from "../components/common/scripts/fb-pixel";

import requestUtils from "../utils/requests";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  // set up context following this: https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
  const [language, setLanguage] = useState("en");
  const languageValue = { language, setLanguage };

  const [theme, setTheme] = useState("light");
  const themeValue = { theme, setTheme };

  const resizeWindow = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  const router = useRouter();

  useEffect(() => {
    requestUtils.setForbiddenInterceptor();
    resizeWindow();
    window.addEventListener("resize", () => {
      resizeWindow();
    });
    dragndropPolyfill();
    if (process.env.INCLUDE_GOOGLE_ANALYTICS === "yes") {
      ReactGA.initialize("UA-170704013-1");
    }
  }, []);

  useEffect(() => {
    if (process.env.INCLUDE_GOOGLE_ANALYTICS === "yes") {
      ReactGA.ga("set", "page", router.asPath);
      ReactGA.ga("send", "pageview");
    }
  }, [router.asPath]);



  return (
    <LoadingContextProvider>
      <UserContextProvider>
        <SocketProvider>
          <ShareProvider>
            <ScheduleProvider>
              <LanguageContext.Provider value={languageValue}>
                <ThemeContext.Provider value={themeValue}>
                  <AssetContextProvider>
                    <TeamContextProvider>
                      <Head>
                        <script
                          type="text/javascript"
                          src="https://www.dropbox.com/static/api/2/dropins.js"
                          id="dropboxjs"
                          data-app-key={process.env.DROPBOX_API_KEY}
                        ></script>
                      </Head>
                      {process.env.INCLUDE_PIXEL === "yes" && <FBPixel />}
                      {/**
                       * todo handle Errorboundary design in refactoring later
                       */}
                      <ErrorBoundary>
                        <Component {...pageProps} />
                      </ErrorBoundary>
                    </TeamContextProvider>
                  </AssetContextProvider>
                </ThemeContext.Provider>
              </LanguageContext.Provider>
            </ScheduleProvider>
          </ShareProvider>
        </SocketProvider>
      </UserContextProvider>
    </LoadingContextProvider >
  );
}

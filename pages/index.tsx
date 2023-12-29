// Components
import AppLayout from "../components/common/layouts/app-layout";
import Spinner from "../components/common/spinners/spinner";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";
import { useEffect } from "react";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const MainPage = () => {

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.HOME, ...data })
  }, []);

  return (
    <>
      <AppLayout title="Sparkfive">
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}
        >
          <Spinner />
        </div>
      </AppLayout>
    </>
  )
};

export default MainPage;

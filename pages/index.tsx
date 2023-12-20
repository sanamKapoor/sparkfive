// Components
import AppLayout from "../components/common/layouts/app-layout";
import Spinner from "../components/common/spinners/spinner";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";
import { useEffect } from "react";

const MainPage = () => {

  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.HOME)
},[]);

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
)};

export default MainPage;

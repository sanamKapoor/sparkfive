// Components
import AppLayout from "../components/common/layouts/app-layout";
import Spinner from "../components/common/spinners/spinner";

const MainPage = () => (
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
);

export default MainPage;

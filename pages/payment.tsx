// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Payment from "../components/payment";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const PaymentPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.PAYMENT)
},[]);

  return(
  <>
    <AppLayout title="Payment">
      <AuthLayout>
        <Payment />
      </AuthLayout>
    </AppLayout>
  </>
)};

export default PaymentPage;

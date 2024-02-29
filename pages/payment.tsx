// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Payment from "../components/payment";
import { pages } from "../constants/analytics";
import useAnalytics from "../hooks/useAnalytics";

const PaymentPage = () => {

const { pageVisit } = useAnalytics();

useEffect(() => {    
  pageVisit(pages.PAYMENT)
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

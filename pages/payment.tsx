// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Payment from "../components/payment";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";

const PaymentPage = () => {

const data = usePageInfo();

useEffect(() => {    
  analyticsApi.capturePageVisit({ name: pages.PAYMENT, ...data })
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

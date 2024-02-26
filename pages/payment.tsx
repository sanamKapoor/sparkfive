// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Payment from "../components/payment";

const PaymentPage = () => (
  <>
    <AppLayout title="Payment">
      <AuthLayout>
        <Payment />
      </AuthLayout>
    </AppLayout>
  </>
);

export default PaymentPage;

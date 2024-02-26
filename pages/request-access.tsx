// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import RequestAccess from "../components/request-access";

const RequestAccessPage = () => (
  <>
    <AppLayout title="Request Access">
      <AuthLayout>
        <RequestAccess />
      </AuthLayout>
    </AppLayout>
  </>
);

export default RequestAccessPage;

// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Signup from "../components/signup";
import useAnalytics from "../hooks/useAnalytics";
import { pages } from "../constants/analytics";

const SignupPage = () => {
  const {trackPage} = useAnalytics();

  useEffect(() => {
    trackPage(pages.UPLOAD_APPROVAL)
},[]);

  return(
  <>
    <AppLayout title="Sign Up">
      <AuthLayout>
        <Signup />
      </AuthLayout>
    </AppLayout>
  </>
)};

export default SignupPage;

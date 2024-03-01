// Components
import { useEffect } from "react";
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Signup from "../components/signup";
import { pages } from "../constants/analytics";
import usePageInfo from "../hooks/usePageInfo";
import analyticsApi from "../server-api/analytics";
import useAnalytics from "../hooks/useAnalytics";

const SignupPage = () => { 
  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.TRIAL_SIGNUP)
  },[]);

  return (
    <>
      <AppLayout title="Sign Up">
        <AuthLayout>
          <Signup onlyWorkEmail={true} />
        </AuthLayout>
      </AppLayout>
    </>
  )
};

export default SignupPage;

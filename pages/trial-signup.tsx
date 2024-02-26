// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Signup from "../components/signup";

const SignupPage = () => (
  <>
    <AppLayout title="Sign Up">
      <AuthLayout>
        <Signup onlyWorkEmail={true} />
      </AuthLayout>
    </AppLayout>
  </>
);

export default SignupPage;

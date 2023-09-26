// Components
import AppLayout from "../components/common/layouts/app-layout";
import AuthLayout from "../components/common/layouts/auth-layout";
import Login from "../components/login";

const LoginPage = () => {
  return (
    <AppLayout title="Log In">
      <AuthLayout>
        <Login />
      </AuthLayout>
    </AppLayout>
  );
};

export default LoginPage;

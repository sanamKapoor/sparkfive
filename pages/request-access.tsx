import Head from "next/head";

// Components
import AuthLayout from "../components/common/layouts/auth-layout";
import RequestAccess from "../components/request-access";

const RequestAccessPage = () => (
  <>
    <Head>
      <title>Request Access</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <AuthLayout>
      <RequestAccess />
    </AuthLayout>
  </>
);

export default RequestAccessPage;

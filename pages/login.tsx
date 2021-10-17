import Head from 'next/head'

// Components
import AuthLayout from '../components/common/layouts/auth-layout'
import Login from '../components/login'

const LoginPage = () => {
    return <>
        <Head>
            <title>Log In</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <AuthLayout>
            <Login/>
        </AuthLayout>
    </>
}

export default LoginPage

import styles from './index.module.css'
import Link from 'next/link'
import {useContext} from "react";

// Container
import AuthContainer from '../common/containers/auth-container'
import LoginForm from './login-form'
import ProvidersAuth from '../common/containers/providers-auth'

import { UserContext } from "../../context"


const SignIn = () => {
    const { vanityCompanyInfo } = useContext(UserContext)
    return <main className={`${styles.container} container-centered`}>
        <AuthContainer
            vanityCompanyInfo={vanityCompanyInfo}
            title='Welcome Back!'
            subtitle='Log In to Sparkfive'
        >
            <LoginForm teamId={vanityCompanyInfo ? vanityCompanyInfo.id : null}/>
            <div className={styles.or}>OR</div>
            <ProvidersAuth/>
        </AuthContainer>
        <p className='nav-text'>Don't have an account?
            {!vanityCompanyInfo && <Link href='/signup'><span>Sign Up</span></Link>}
            {vanityCompanyInfo && <Link href='/request-access'><span>Request Access</span></Link>}
        </p>
    </main>
}

export default SignIn

import { useRouter} from "next/router";
import styles from './index.module.css'
import Link from 'next/link'
import {useContext, useEffect, useState} from 'react'

// Components
import AuthContainer from '../common/containers/auth-container'
import SignupForm from './signup-form'
import { UserContext } from "../../context"


import urlUtils from '../../utils/url'

const RequestAccess = ({ onlyWorkEmail = true}) => {
  const { query } = useRouter()
  const { vanityCompanyInfo } = useContext(UserContext)
  const [shareInviteCode, setShareInviteCode] = useState(undefined)

  useEffect(() => {
    const { code } = urlUtils.getQueryParameters()
    if (code) {
      setShareInviteCode(code)
    }
  }, [])

  return (
    <main className={`${styles.container} container-centered`}>
      <AuthContainer
        vanityCompanyInfo={vanityCompanyInfo}
        title={query.inviteCode ? 'Get started with Sparkfive today' : 'Get started for FREE today'}
        subtitle={query.inviteCode ? '' : 'No credit card required - 14 day free trial'}
      >
        <SignupForm inviteCode={shareInviteCode} teamId={vanityCompanyInfo?.id} onlyWorkEmail={onlyWorkEmail}/>
      </AuthContainer>
      {!shareInviteCode && <p className='nav-text'>Already have an account? <Link href='/login'><span>Log In</span></Link></p>}
    </main>
  )
}

export default RequestAccess

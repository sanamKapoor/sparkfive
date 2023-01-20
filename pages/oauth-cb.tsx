import { useEffect, useContext } from 'react'
import Router from 'next/router'
import { UserContext, LoadingContext } from '../context'
import authApi from '../server-api/auth'
import cookiesUtil from '../utils/cookies'
import urlUtils from '../utils/url'
import toastUtils from '../utils/toast'

// Components
import Spinner from '../components/common/spinners/spinner'

// Simple redirect page
const OauthCbPage = () => {

  const { afterAuth } = useContext(UserContext)
  const { setIsLoading } = useContext(LoadingContext)
  useEffect(() => {
    // TODO: Include state string verification
    const { code } = urlUtils.getQueryParameters()
    signIn(decodeURIComponent(code as string))
  }, [])

  const signIn = async (accessCode) => {
    const provider = cookiesUtil.get('oauthProvider')
    const cookieInviteCode = cookiesUtil.get('inviteCode')
    const signupPrice = cookiesUtil.get('signupPrice')
    try {
      setIsLoading(true)
      let inviteCode
      // Check if inviteCode is valid
      if (cookieInviteCode && cookieInviteCode !== 'undefined') {
        inviteCode = cookieInviteCode
      }
      const { data } = await authApi.signIn(provider, accessCode, { inviteCode, signupPrice })
      await afterAuth(data)
    } catch (err) {
      if (err.response?.data?.message) toastUtils.error(err.response.data.message)
      console.log(err)
      if (cookieInviteCode && cookieInviteCode !== 'undefined') {
        Router.replace(`/signup?inviteCode=${cookieInviteCode}`)
      } else {
        Router.replace('/login')
      }
    } finally {
      setIsLoading(false)
      cookiesUtil.remove('inviteCode')
      cookiesUtil.remove('signupPrice')
    }
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <Spinner />
    </div>
  )
}

export default OauthCbPage

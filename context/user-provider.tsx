import Router, { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { LoadingContext, UserContext } from '../context'
import cookiesUtils from '../utils/cookies'
import requestsUtils from '../utils/requests'
import { getSubdomain } from '../utils/domain'

import userApi from '../server-api/user'
import teamApi from '../server-api/team'
import SpinnerOverlay from "../components/common/spinners/spinner-overlay";
import url from '../utils/url'
import advancedConfigParams from '../utils/advance-config-params'

const allowedBase = ['/signup', 'trial-signup', 'request-access', '/share', '/reset-password', '/forgot-password', '/two-factor', '/collections']

export default ({ children }) => {
  const [user, setUser] = useState(null)
  const [initialLoadFinished, setInitialLoadFinished] = useState(false)
  const [waitToVerifyDomain, setWaitToVerifyDomain] = useState(false)
  const [vanityCompanyInfo, setVanityCompanyInfo] = useState()
  const [cdnAccess, setCdnAccess] = useState(false)
  const [transcriptAccess, setTranscriptAccess] = useState(false)
  const [advancedConfig, setAdvancedConfig] = useState(advancedConfigParams)

  const { setIsLoading } = useContext(LoadingContext)

  const router = useRouter()

  const fetchUser = async (redirectLogin = false) => {
    // Skip fetching user if on collections page
    if (Router.pathname.indexOf('/collections') !== -1) return

    if (Router.pathname.indexOf('/guest-upload') !== -1) return

    if (redirectLogin) return Router.replace('/login')
    const jwt = cookiesUtils.get('jwt')

    if (jwt) requestsUtils.setAuthToken(jwt)

    const needTwoFactor = cookiesUtils.get('twoFactor')
    cookiesUtils.remove('twoFactor')
    if (needTwoFactor && Router.pathname.indexOf('/two-factor') === -1) {
      return Router.replace('/two-factor')
    }

    if (jwt && !needTwoFactor) {
      try {
        setIsLoading(true)
        const query = url.getQueryStringFromObject(Router.query)

        const { data } = await userApi.getUserData()
        const teamResponse = await teamApi.getTeam()
        // console.log(teamResponse.data)
        setCdnAccess(teamResponse.data.cdnAccess)
        setTranscriptAccess(teamResponse.data.transcript)

        const { data: advOptions } = await teamApi.getAdvanceOptions()
        setAdvancedConfig({...advOptions, set: true})

        // Custom role will use custom permission here
        if (data.role.type === 'custom') {
          data.permissions = data.role.permissions
        }
        setUser(data)
        if (!data.firstTimeLogin && Router.pathname.indexOf('/main/setup') === -1) {
          await Router.replace('/main/setup')
        }
        else if (Router.pathname.indexOf('/main') === -1) {
          if (data.team.plan.type === 'dam') {
            await Router.replace('/main/assets' + (query === '' ? '' : `?${query}`))
          } else {
            await Router.replace('/main/overview')
          }
        } else if (data.firstTimeLogin &&
          data.team.plan.type === 'dam' &&
          Router.pathname.indexOf('/user-settings') === -1 &&
          Router.pathname.indexOf('/advanced-options') !== -1 &&
          Router.pathname.indexOf('/deleted-assets-list') === -1) {
          await Router.replace('/main/assets' + (query === '' ? '' : `?${query}`))
        }
      } catch (err) {
        console.log(err)
        initialRedirect()
      } finally {
        setIsLoading(false)
      }
    } else initialRedirect()
  }

  const initialRedirect = () => {
    if (!allowedBase.some(url => Router.pathname.indexOf(url) !== -1)) {
      Router.replace('/login')
    }
  }

  const logOut = () => {
    setUser(null)
    cookiesUtils.remove('jwt')
    requestsUtils.removeAuthToken()
    Router.replace('/login')
  }

  const hasPermission = (requiredPermissions = []) => {
    // console.warn(`Check permission: `, requiredPermissions, user?.permissions)
    if (requiredPermissions.length === 0) return true
    // check by features/permissions
    let allowed = requiredPermissions.some(perm => user?.permissions.map(userPerm => userPerm.id).includes(perm))

    // check by roleId
    if (!allowed) {
      allowed = requiredPermissions.some(role => user && role === user.roleId)
    }
    return allowed;
  }

  const afterAuth = async ({ twoFactor, token }) => {
    cookiesUtils.setUserJWT(token)
    if (twoFactor) {
      cookiesUtils.set('twoFactor', 'true')
    }
    await fetchUser()
  }

  useEffect(() => {
    if (router.route) {
      getUserData()
    }
  }, [router.route])

  const verifyDomain = async () => {
    const subdomain = getSubdomain();

    if (subdomain) {
      setWaitToVerifyDomain(true)

      try {
        const results = await teamApi.verifyDomain(subdomain)

        setVanityCompanyInfo(results.data)

        setWaitToVerifyDomain(false)
      } catch (e) { // Cant verify domain
        setWaitToVerifyDomain(false)
        // console.log(process.env.CLIENT_BASE_URL)
        // back to login page
        // window.open(`${process.env.CLIENT_BASE_URL}/login`,"_self")
        router.replace(`${process.env.CLIENT_BASE_URL}/login`)
      }
    } else {
      setWaitToVerifyDomain(false)
    }
  }

  useEffect(() => {
    verifyDomain()
  }, [])

  const getUserData = async () => {
    await fetchUser()
    setInitialLoadFinished(true)
  }

  const userValue = {
    user,
    setUser,
    advancedConfig,
    setAdvancedConfig,
    fetchUser,
    logOut,
    hasPermission,
    initialLoadFinished,
    afterAuth,
    vanityCompanyInfo,
    cdnAccess,
    advancedConfig,
    setAdvancedConfig,
    transcriptAccess
  }

  return (
    <UserContext.Provider value={userValue}>
      <>
        {initialLoadFinished && children}
        {waitToVerifyDomain && <SpinnerOverlay />}
      </>
    </UserContext.Provider>
  )
}

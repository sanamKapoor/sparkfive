import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import urlUtils from '../utils/url'

export const useQueryStrings = (defaultValues: any) => {
  const [result, setResult] = useState<any>({})
  const [params, setParams] = useState<any>({})
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useRouter()
  
  useEffect(() => {
    setParams(urlUtils.getQueryParameters())
    setIsLoaded(true)
  }, [window.location.search])

  useEffect(() => {
    if (Object.keys(params).length > 0) {
      setResult(params)
    } else if (isLoaded) {
      setResult(defaultValues)
      router.push(`${window.location.pathname}?${urlUtils.getQueryStringFromObject(defaultValues)}`)
    }
  }, [params, isLoaded])

  const setter = useCallback((values: any) => {
    const newParams = {
      ...params,
      ...values
    }

    const qs = urlUtils.getQueryStringFromObject(newParams)
    return router.push(`${window.location.pathname}?${qs}`)
  }, [defaultValues])


  return [result, setter]
}
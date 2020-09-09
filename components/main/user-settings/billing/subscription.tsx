import styles from './subscription.module.css'
import { useState, useContext, useEffect } from 'react'
import { TeamContext } from '../../../../context'

// Components
import SubscriptionNameForm from './subscription-name-form'
import SubscriptionAddressForm from '../company/subscription-address-form'
import SubscriptionPlan from './subscription-plan'

const Subscription = () => {

  const { getPlan } = useContext(TeamContext)

  useEffect(() => {
    getPlan()
  }, [])

  return (
    <div>
      <SubscriptionPlan />
    </div>
  )
}

export default Subscription
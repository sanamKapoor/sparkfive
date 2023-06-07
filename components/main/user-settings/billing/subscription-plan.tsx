import styles from './subscription-plan.module.css'
import { useContext, useState } from 'react'
import { TeamContext, UserContext } from '../../../../context'
import { format, differenceInDays } from 'date-fns'
import { formatCurrency } from '../../../../utils/numbers'
import Link from 'next/link'
import planApi from '../../../../server-api/plan'
import toastUtils from '../../../../utils/toast'

// Components
import Button from '../../../common/buttons/button'
import BaseModal from '../../../common/modals/base'

const SubscriptionData = ({ label, value }) => (
  <div className={styles.item}>
    <div>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
)

const SubscriptionPlan = ({ paymentMethod, goCheckout }) => {
  const { plan } = useContext(TeamContext)
  const { user } = useContext(UserContext);

  const [cancelOpen, setCancelOpen] = useState(false)

  const getFrequency = () => {
    if (plan) {
      const { interval } = plan.stripePrice
      if (interval === 'month') return 'Monthly'
      else return 'Annual'
    }
  }

  const getAmount = () => {
    if (plan) {
      return formatCurrency(plan.stripePrice.amount / 100)
    }
  }

  const cancelPlan = async () => {
    try {
      await planApi.cancelPlan()
      toastUtils.success(`Plan canceled. You won't be billed at the end of your current period.`)
      setCancelOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  let productName = plan?.stripeProduct.name
  if (plan?.status === 'trialing') {
    const remainingDays = differenceInDays(new Date(plan.endDate), new Date())
    productName += ` (Trial - ${remainingDays} day(s) remaining)`
  }

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const getStorageUsed = () => {
    return formatBytes( parseInt(user?.storageUsed || 0))
  }

  return (
    <div className={styles.container}>
      <h3>Subscription</h3>
      {plan &&
        <div className={styles['sub-container']}>
          <div className={'fields-first'}>
            {/*<div className={styles.plan}>*/}
            {/*  <SubscriptionData*/}
            {/*    label={'Plan Name'}*/}
            {/*    value={productName}*/}
            {/*  />*/}
            {/*</div>*/}
            <div className={styles['prop-pair']}>
              <SubscriptionData
                  label={'Plan Name'}
                  value={productName}
              />
              <SubscriptionData
                  label={'Storage used'}
                  value={getStorageUsed()}
              />
            </div>
            <div className={styles['prop-pair']}>
              <SubscriptionData
                label={'Frequency'}
                value={getFrequency()}
              />
              <SubscriptionData
                label={'Amount'}
                value={getAmount()}
              />
            </div>
            <div className={styles['prop-pair']}>
              <SubscriptionData
                label={'Start Date'}
                value={format(new Date(plan.startDate), 'MM/dd/yyyy')}
              />
              <SubscriptionData
                label={'Next Billing Date'}
                value={format(new Date(plan.endDate), 'MM/dd/yyyy')}
              />
            </div>
          </div>
          <div className={styles['button-actions']}>
            {!paymentMethod && plan.status === 'trialing' &&
              <Button
                text='Subscribe'
                type='button'
                styleType='input-height-primary'
                onClick={goCheckout}
              />
            }
            <Link href='/main/user-settings/plan'>
              <a>
                <Button
                  text='Change Plan'
                  type='button'
                  styleType='input-height-primary'
                />
              </a>
            </Link>
            <Button
              text='Cancel Plan'
              type='button'
              styleType='input-height-secondary'
              onClick={() => setCancelOpen(true)}
            />
          </div>
        </div>
      }
      <BaseModal
        closeModal={() => setCancelOpen(false)}
        modalIsOpen={cancelOpen}
        headText={'Are you sure you want to cancel your plan?'}
        confirmAction={cancelPlan}
        confirmText={'Cancel plan'} >
      </BaseModal>
    </div>
  )
}

export default SubscriptionPlan

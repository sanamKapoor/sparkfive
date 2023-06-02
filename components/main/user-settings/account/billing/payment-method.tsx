import styles from './payment-method.module.css'

import planApi from '../../../../../server-api/plan'
import { useState } from 'react'

// Components
import BaseModal from '../../../../common/modals/base'
import Button from '../../../../common/buttons/button'
import CreditCardForm from '../../../../common/payment/credit-card-form'

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  const [modalActive, setModalActive] = useState(false)

  const updatePaymentMethod = async (paymentMethodId) => {
    try {
      const { data } = await planApi.addPaymentMethod({ paymentMethodId })
      setPaymentMethod(data)
    } catch (err) {
      console.log(err)
    } finally {
      setModalActive(false)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Active Card</h3>
        <div className={`${styles['card-info']}`}>
          {paymentMethod ?
            <div>
              <div>{paymentMethod.name}</div>
              <div>{`${paymentMethod.brand} ending in ${paymentMethod.last4}`}</div>
              <div>{`Expires ${paymentMethod.expMonth}/${paymentMethod.expYear} `}</div>
            </div>
            :
            <div className={'fields-first'}>
              No card configured
            </div>
          }
          <div>
            <Button
              text='Update Card'
              type='button'
              onClick={() => setModalActive(true)}
              styleType='primary' />
          </div>
        </div>
      </div>
      <BaseModal
        headText={<span className={styles.modal_title}>Update Credit Card</span>}
        subText={<span className={styles.modal_title}>Please enter your credit card details below</span>}
        closeModal={() => setModalActive(false)}
        noHeightMax={true}
        additionalClasses={['visible-block']}
        modalIsOpen={modalActive}>
        <CreditCardForm
          onConfirm={updatePaymentMethod}
          buttonText={'Update Card'}
          buttonDisabled={false}
          noBottomMargin={true}
        />
      </BaseModal>
    </>
  )
}

export default PaymentMethod
import { useState, useEffect } from 'react'
import styles from './password-overlay.module.css'
import { GeneralImg } from '../../assets'

// Components
import AuthContainer from '../common/containers/auth-container'
import Input from '../common/inputs/input'
import AuthButton from '../common/buttons/auth-button'

const CreateOverlay = ({ onPasswordSubmit }) => {
  const [sharePassword, setSharePassword] = useState('')

  // useEffect(() => {
  //   setSharePassword('')
  // }, [])

  const submitPassword = (e) => {
    e.preventDefault()
    onPasswordSubmit(sharePassword)
  }

  return (
    <div className={`app-overlay ${styles.container}`}>
      <div className={`${styles.container} container-centered`}>
        <img src={GeneralImg.logoHorizontal} className={styles.logo} />
        <AuthContainer
          title='Welcome!'
          subtitle={'Enter password to proceed'}>
          <form onSubmit={submitPassword} className={styles['password-form']}>
            <Input placeholder={'Password'} onChange={(e) => setSharePassword(e.target.value)} styleType={'regular-short'} type='password'/>
            <AuthButton
              text={'Submit'}
              type={'submit'}
            />
          </form>
        </AuthContainer>
      </div>
    </div >
  )
}

export default CreateOverlay

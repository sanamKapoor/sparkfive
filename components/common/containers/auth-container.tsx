import styles from './auth-container.module.css'

const AuthContainer = ({ title, subtitle = '', children }) => (
  <section className={styles.container}>
    <h2>
      {title}
    </h2>
    {subtitle &&
      <h4>
        {subtitle}
      </h4>
    }
    <div className='card-content'>
      {children}
    </div>
  </section>
)

export default AuthContainer
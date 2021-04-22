import styles from './button.module.css'

const Button = ({ text, type, onClick = (e) => { }, disabled = false, styleType = '', styleTypes = [], className = '' }) => (
  <button
    className={`${styles.container} ${styles[styleType]} ${styles[type]} ${className} ${styleTypes.map(styleItem => styles[styleItem]).join(' ')}`}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </button>
)

export default Button

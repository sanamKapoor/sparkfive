import styles from './button.module.css'

const Button = ({ text, type, onClick = (e) => { }, disabled = false, styleType = '', styleTypes = [], className = '', form }) => {
  const props: any = {}
  if(form){
    props.form = form
  }
  return <button
      className={`${styles.container} ${styles[styleType]} ${styles[type]} ${className} ${styleTypes.map(styleItem => styles[styleItem]).join(' ')}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
  >
    {text}
  </button>
}

export default Button

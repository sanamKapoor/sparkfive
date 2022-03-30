import styles from './input.module.css'

const Input = (props) => {
  const { styleType, additionalClasses, ...rest } = props
  return (
    <input
      {...rest}
      className={`${styles.container} ${styleType && styles[styleType]} ${additionalClasses}`}
    />
  )
}

export default Input

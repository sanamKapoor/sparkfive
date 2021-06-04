import styles from './text-area.module.css'

const TextArea = (props) => (
    <textarea
        {...props}
        className={`${styles.container} ${props.styleType && styles[props.styleType]} ${props.noResize && styles['no-resize']} ${props.additionalClasses}`}
    />
)

export default TextArea

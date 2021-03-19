import styles from './icon-clickable.module.css'
import ReactTooltip from 'react-tooltip'

const IconClickable = ({ src, onClick = (e) => { }, additionalClass = '', tooltipId = '', tooltipText }) => (
  <>
    <img data-tip data-for={tooltipId} src={src} onClick={onClick} className={`${styles.button} ${additionalClass}`} />
    {tooltipText &&
      <ReactTooltip id={tooltipId} delayShow={300} effect='solid'>{tooltipText}</ReactTooltip>
    }
  </>

)

export default IconClickable
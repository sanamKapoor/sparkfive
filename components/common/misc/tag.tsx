import { capitalCase } from 'change-case'
import styles from './tag.module.css'

const Tag = ({ tag, canRemove = false, removeFunction = () => { }, editFunction = () => { }, altColor = '' }) => (
  <div className={`${styles.container} ${altColor && styles[`alt-color-${altColor}`]}`}>
    <span onDoubleClick={editFunction}>{tag}</span>
    {canRemove &&
      <span onClick={removeFunction} className={styles.remove}>x</span>
    }
  </div>
)

export default Tag

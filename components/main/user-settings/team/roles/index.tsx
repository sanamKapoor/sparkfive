import styles from './index.module.css'
import IconClickable from "../../../../common/buttons/icon-clickable";
import { Utilities } from '../../../../../assets'

const Roles = ({onAdd}) => {

  const roles = [
    {
      name: 'Admin',
      type: 'preset'
    },
    {
      name: 'User',
      type: 'preset'
    }
  ]
  return (
      <div>
        <h3>Role</h3>

        {roles.map((request, index)=>{
          return <div
              className={`row align-center ${styles['data-row']} ${index === roles.length - 1 ? '' : styles['ghost-line']}`}
              key={index}>
            <div className={`col-10`}>
              <p className={'font-weight-600'}>{`${index+1}.`}</p>
            </div>
            <div className={`col-30 ${styles['name-col']}`}>
              <p className={'font-weight-600'}>{request.name}</p>
            </div>
            <div className={`col-10 ${styles['action']}`}>
                    <span>{request.type}</span>
            </div>
            <div className={`col-10 align-center pointer ${styles['action']}`}>
              edit
            </div>
            <div className={`col-10 align-center pointer ${styles['action']}`}>
             delete
            </div>
          </div>
        })}

        <div className={`row ${styles['field-block']}`}>
          <div className={`col-100`}>
            <div className={`row p-l-r-10`}>
              <div className={`add ${styles['select-add']}`} onClick={onAdd}>
                <IconClickable src={Utilities.add} />
                <span>Add New Custom Role</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Roles

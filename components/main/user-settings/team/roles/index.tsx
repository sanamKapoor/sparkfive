import styles from './index.module.css'
import IconClickable from "../../../../common/buttons/icon-clickable";
import { Utilities } from '../../../../../assets'

import teamApi from '../../../../../server-api/team'
import {useEffect, useState} from "react";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import ConfirmModal from "../../../../common/modals/confirm-modal";

const Roles = ({onAdd, onEdit}) => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState()

  const getRoleList = async () => {
    const { data } = await teamApi.getRoles();
    setRoles(data)
    setLoading(false)
  }

  const deleteRole = async() => {
    setOpenModal(false)
    if(selectedRole){
      setLoading(true)
      // @ts-ignore
      await teamApi.deleteRole(selectedRole.id);

      getRoleList();
    }

  }

  useEffect(()=>{
    getRoleList();
  },[])

  return (
      <div>
        <h3>Role</h3>

        {roles.map((role, index)=>{
          return <div
              className={`row align-center ${styles['data-row']} ${index === roles.length - 1 ? '' : styles['ghost-line']}`}
              key={index}>
            <div className={`col-10`}>
              <p className={'font-weight-600'}>{`${index+1}.`}</p>
            </div>
            <div className={`col-30 ${styles['name-col']}`}>
              <p className={'font-weight-600'}>{role.name}</p>
            </div>
            <div className={`col-10 ${styles['action']}`}>
                    <span>{role.type}</span>
            </div>
            {role.type !== 'preset' && <div className={`col-10 align-center pointer ${styles['action']}`}
                                            onClick={()=>{onEdit(role.id)}}
            >
              edit
            </div>}
            {role.type !== 'preset' && <div className={`col-10 align-center pointer ${styles['action']}`} onClick={()=>{
              setSelectedRole(role)
              setOpenModal(true)
            }}>
             delete
            </div>}
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

        <ConfirmModal
            modalIsOpen={openModal}
            closeModal={() => {setSelectedRole(undefined); setOpenModal(false)}}
            confirmAction={deleteRole}
            confirmText={'Delete'}
            message={`Are you sure you want to delete ${selectedRole?.name}?`}
        />

        {loading && <SpinnerOverlay />}
      </div>
  )
}

export default Roles

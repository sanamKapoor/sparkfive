import styles from './member.module.css'
import moment from "moment";
import copyClipboard from 'copy-to-clipboard'

import toastUtils from '../../../../utils/toast'

import inviteApi from '../../../../server-api/invite'


import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../../../context'
import { capitalCase } from 'change-case'
import IconClickable from "../../../common/buttons/icon-clickable";

import { AssetOps } from '../../../../assets'

// Components

const Member = ({ id, email, role, name, profilePhoto, type, editAction, deleteAction, expirationDate, code, onReload }) => {
  const { user } = useContext(UserContext)

  const checkExpireDate = (date) => {
      return new Date() > new Date(date);
  }

    const getExpireDate = (date) => {
        if(new Date() > new Date(date)){
            return 'Expired'
        }else{
            return `Expired ${moment(date).format("MMM Do YY")}`
        }
    }

    const copyLink = (code) => {
        copyClipboard(`${process.env.CLIENT_BASE_URL}/signup?inviteCode=${code}`)
    }

    const resend = async(id) => {
        await inviteApi.resendInvite(id)

        toastUtils.success('Invitation sent successfully')

        onReload()
    }

  return (
    <li className={styles.container}>
      <div className={`${styles['name-email']} ${type === 'invite' ? styles['name-email-invite'] : ''}`}>
        {type === 'member' && <div>{name}</div>}
        <div>{email}</div>
      </div>
        {type === 'invite' && <div className={styles['expire-date']}>
            {getExpireDate(expirationDate)}
        </div>}
        {type === 'invite' && <div className={`${styles['operation-buttons']} ${!checkExpireDate(expirationDate) ? styles['hidden'] : ''}`}>
            <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`share${''}`]}  tooltipText={'Resend'} tooltipId={'Resend'} onClick={() => {resend(id)}} />
        </div>}
        {type === 'invite' && <div className={styles['operation-buttons']}>
            <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`copy${''}`]}  tooltipText={'Copy'} tooltipId={'Copy'} onClick={() => {copyLink(code)}} />
        </div>}
      <div className={styles.details}>
        <div className={styles.role}>{capitalCase(role.name)}</div>
        {user.id !== id &&
          <>
            <div onClick={editAction}
              className={styles.action}>
              edit
            </div>
            <div onClick={deleteAction}
              className={styles.action}>
              delete
            </div>
          </>
        }
      </div>
    </li>
  )
}

export default Member

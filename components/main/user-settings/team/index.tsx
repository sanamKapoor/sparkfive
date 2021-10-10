import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import update from 'immutability-helper'
import toastUtils from '../../../../utils/toast'
import roleApi from '../../../../server-api/role'
import inviteApi from '../../../../server-api/invite'
import requestApi from '../../../../server-api/request'
import teamApi from '../../../../server-api/team'
import { TeamContext } from '../../../../context'
import { capitalCase } from 'change-case'

// Components
import TeamInviteForm from './team-invite-form'
import MemberList from './member-list'
import MemberDetail from './member-detail'
import ConfirmModal from '../../../common/modals/confirm-modal'
import RequestAccessList from "./request-access-list";
import RequestForm from "./request-form";
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";
import IconClickable from "../../../common/buttons/icon-clickable";
import { Utilities } from '../../../../assets'
import SectionButton from "../../../common/buttons/section-button";
import Roles from "./roles";
import AddCustomRole from "./add-custom-role";

const Team = () => {

  const [roles, setRoles] = useState([])
  const [invites, setInvites] = useState([])
  const [requests, setRequests] = useState([])

  const { teamMembers, getTeamMembers, setTeamMembers } = useContext(TeamContext)

  const [selectedMember, setSelectedMember] = useState(undefined)
  const [selectedDeleteMember, setSelectedDeleteMember] = useState(undefined)

  const [selectedRequest, setSelectedRequest] = useState(undefined)

  const [loading, setLoading] = useState(false)

  const [tab, setTab] = useState(0)
  const [selectedRole, setSelectedRole] = useState()


  useEffect(() => {
    getRoles()
    getTeamMembers()
    getInvites()
    getAccessRequest()
  }, [tab])

  const getRoles = async () => {
    try {
      const { data } = await roleApi.getroles()
      setRoles(data)
    } catch (err) {
      console.log(err)
    }
  }

  const getInvites = async () => {
    try {
      const { data } = await inviteApi.getInvites()
      setInvites(data)
    } catch (err) {
      console.log(err)
    }
  }

  const getAccessRequest = async () => {
    try {
      const { data } = await requestApi.getRequests()
      setRequests(data)
    } catch (err) {
      console.log(err)
    }
  }

  const sendInvitation = async (email, roleId) => {
    try {
      const { data } = await inviteApi.sendInvite({ email, roleId })
      setInvites(update(invites, {
        $push: [data]
      }))
      toastUtils.success(`Invitation sent to ${email}`)
    } catch (err) {
      console.log(err)
      if (err.response?.data?.message) toastUtils.error(err.response.data.message)
      else toastUtils.error(`Coudl not send invitation to ${email}`)
    }
  }

  const onDetailSaveChanges = async (id, { roleId, permissions, updatePermissions }) => {
    try {
      setLoading(true)
      if (selectedMember.type === 'member')
        await teamApi.patchTeamMember(id, { roleId, permissions, updatePermissions })
      else
        await inviteApi.patchInvite(id, { roleId, permissions, updatePermissions })


      await getTeamMembers()
      await getInvites()

      setLoading(false)

      setSelectedMember(undefined)

      toastUtils.success('Changes saved successfully')
    } catch (err) {
      setLoading(false)

      toastUtils.error(err.response.data?.message || 'Internal server error')
    }
  }

  const deleteMember = async () => {
    try {
      setLoading(true)
      const { id } = selectedDeleteMember.member
      if (selectedDeleteMember.type === 'member') {
        await teamApi.disableTeamMember(id)
        setTeamMembers(update(teamMembers, {
          $splice: [[teamMembers.findIndex(member => member.id === id), 1]]
        }))
      } else {
        await inviteApi.deleteInvite(selectedDeleteMember.member.id)
        setInvites(update(invites, {
          $splice: [[invites.findIndex(invite => invite.id === id), 1]]
        }))
      }
      setLoading(false)
      toastUtils.success('Member deleted successfully')
    } catch (err) {
      setLoading(false)
      console.log(err)
    } finally {
      setSelectedDeleteMember(undefined)
    }
  }

  const mappedRoles = roles.map((role) => ({ ...role, label: capitalCase(role.name), value: role.id }))

  const onRequestChange = async (type: string, request) => {
    switch (type){
      case 'review': {
        setSelectedRequest(request)
        break;
      }
      case 'accept': {
        setLoading(true)
        await requestApi.approve(request.id)
        await getAccessRequest()
        toastUtils.success('Approve successfully')
        setSelectedRequest(undefined)
        setLoading(false)
        break;
      }
      case 'reject': {
        setLoading(true)
        await requestApi.reject(request.id)
        await getAccessRequest()
        toastUtils.success('Reject successfully')
        setSelectedRequest(undefined)
        setLoading(false)
        break;
      }
    }

  }

  const onAddCustomRole = () => {
    setTab(1)
    setSelectedRole(undefined)
  }

  return (
    <div className={styles.container}>

      <div className={styles.buttons}>
        <SectionButton
            text='Members'
            active={tab === 0}
            onClick={() => {setTab(0);setSelectedRole(undefined)}}
        />
        <SectionButton
            text='Roles'
            active={tab === 1}
            onClick={() => {setTab(1);setSelectedRole(undefined)}}
        />
        {tab === 2 && <SectionButton
            text='Add Custom Role'
            active={tab === 2}
            onClick={() => setTab(2)}
        />}
      </div>

      {tab === 0 && <>
        {selectedMember && <MemberDetail mappedRoles={mappedRoles} member={selectedMember.member} type={selectedMember.type}
                                         onSaveChanges={onDetailSaveChanges} />}

        {selectedRequest && <div className={styles.back} onClick={()=>{setSelectedRequest(undefined)}}>
          <IconClickable src={Utilities.back} />
          <span>Back</span>
        </div>}

        {selectedRequest && <RequestForm
            data={selectedRequest}
            onApprove={()=>{onRequestChange('accept', selectedRequest)}}
            onReject={()=>{onRequestChange('reject', selectedRequest)}}
        />}

        {!selectedMember && !selectedRequest && <>
          <TeamInviteForm
              onInviteSend={sendInvitation}
              mappedRoles={mappedRoles} />
          <div className={styles['main-headers']}>
            <h3>Members</h3>
            <h3>Role</h3>
          </div>

          <MemberList members={teamMembers}
                      type='member'
                      setSelectedMember={setSelectedMember}
                      setSelectedDeleteMember={setSelectedDeleteMember}
          />

          <h3>Pending Invites</h3>
          <MemberList members={invites} type='invite'
                      setSelectedMember={setSelectedMember}
                      setSelectedDeleteMember={setSelectedDeleteMember}
                      onReload={()=>{getInvites()}}
          />


          <h3>Access Requests</h3>
          <RequestAccessList members={requests} type='invite' onChange={onRequestChange} />
        </>}
      </>}

      {tab === 1 && <Roles onAdd={()=>{setTab(2)}} onEdit={(id)=>{setTab(2);setSelectedRole(id)}} />}

      {tab === 2 && <AddCustomRole onSave={onAddCustomRole} role={selectedRole} />}


      <ConfirmModal
        modalIsOpen={selectedDeleteMember !== undefined}
        closeModal={() => setSelectedDeleteMember(undefined)}
        confirmAction={deleteMember}
        confirmText={'Delete'}
        message={`Are you sure you want to delete ${selectedDeleteMember?.member.email}?`}
      />
      {loading && <SpinnerOverlay />}
    </div>
  )
}

export default Team

import { useState, useEffect } from 'react'
import { TeamContext } from '../context'
import toastUtils from '../utils/toast'
import teamApi from '../server-api/team'
import planApi from '../server-api/plan'

export default ({ children }) => {
  const [team, setTeam] = useState(null)
  const [plan, setPlan] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])

  const getTeam = async (once = false) => {
    try {
      // Skip if 'once' option set and team data already loaded
      if (once && team) return
      const { data } = await teamApi.getTeam()
      setTeam(data)
      getPlan({ withStorageUsage: true })
    } catch (err) {
      console.log(err)
    }
  }

  const getPlan = async ({ withStorageUsage = false } = {}) => {
    try {
      const { data } = await planApi.getPlanDetail({ withStorageUsage })
      setPlan(data)
    } catch (err) {
      console.log(err)
    }
  }

  const patchTeam = async (patchData) => {
    try {
      const { data } = await teamApi.patchTeam(patchData)
      setTeam(data)
      toastUtils.success('Changes saved succesfully')
    } catch (err) {
      console.log(err)
    }
  }

  const getTeamMembers = async () => {
    try {
      const { data } = await teamApi.getTeamMembers()
      setTeamMembers(data)
      return data
    } catch (err) {
      console.log(err)
      return null
    }
  }

  const teamValue = {
    team,
    patchTeam,
    getTeam,
    plan,
    getPlan,
    teamMembers,
    setTeamMembers,
    getTeamMembers
  }
  return (
    <TeamContext.Provider value={teamValue}>
      {children}
    </TeamContext.Provider>
  )
}

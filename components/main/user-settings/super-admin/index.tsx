import styles from './index.module.css'
import { useState } from 'react'
import moment from "moment";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

import dateStyles from '../../../common/filter/date-uploaded.module.css'


// Components
import SectionButton from "../../../common/buttons/section-button";
import UserList from "./user-list";
import CompanyList from "./company-list";
import IconClickable from "../../../common/buttons/icon-clickable";
import { Utilities } from '../../../../assets'
import Input from "../../../common/inputs/input";
import Button from "../../../common/buttons/button";
import OptionList from "./option-list";

import superAdminApi from '../../../../server-api/super-admin'
import toastUtils from '../../../../utils/toast'
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";
import { useQueryStrings } from '../../../../hooks/use-query-strings';

import { defaultSortData as companyDefaultSortData } from './company-list-header/types'
import FormInput from "../../../common/inputs/form-input";
import Base from "../../../common/modals/base";
import {approvalList} from "../../../../constants/guest-upload";
import Select from "../../../common/inputs/select";

import { statuses} from "../../../../constants/plans";

const type = [
    {
        label: 'On',
        value: true,
    },
    {
        label: 'Off',
        value: false,
    }
]

const collectionSharedLink = [
    {
        label: 'On',
        value: true,
    },
    {
        label: 'Off',
        value: false,
    }
]

const defaultValues = {
    activeList: 'allUsers',
    sortBy: 'users.lastLogin',
    sortDirection: 'ASC'
}

const SuperAdmin = () => {

    const [viewCompanyDetail, setViewCompanyDetail] = useState()
    const [vanity, setVanity] = useState(type[1].value)
    const [cdnAccess, setCdnAcces] = useState(type[1].value)
    const [advancedCollectionShareLink, setAdvanceShareLink] = useState(collectionSharedLink[1].value)
    const [subdomain, setSubdomain] = useState('')
    const [loading, setLoading] = useState(false)
    const [sortData, setSortData] = useQueryStrings(defaultValues)
    const [showPlanModal, setShowPlanModal] = useState(false)
    const [planDetail, setPlanDetail] = useState({})
    const [benefits, setBenefits] = useState([])

    const onViewCompanySettings =  (data, benefits) => {
        setViewCompanyDetail(data)
        setVanity(data.vanity)
        setSubdomain(data.subdomain ? `${data.subdomain || ""}.${window.location.hostname.replace("www.","")}` : "")
        setCdnAcces(data.cdnAccess)
        setAdvanceShareLink(data.advancedCollectionShareLink)
        setBenefits(benefits.map((benefit)=>{ return {
            label: benefit.id,
            value: benefit.id
        }}))
    }

    const onBack = () => {
        setViewCompanyDetail(undefined)
    }

    const updateTeam = async (data: any) => {
      if(viewCompanyDetail){
          try{
              setLoading(true)
              // @ts-ignore
              await superAdminApi.updateCompanyConfig(viewCompanyDetail.id, data)

              setLoading(false)

              onBack();

              toastUtils.success('Setting changes saved')
          }catch (e){
              setLoading(false)
              console.log(e.response.data?.message)
              toastUtils.error(e.response.data?.message || "Internal server error")
          }

      }
    }

    const updateTeamPlan = async (data: any) => {
        if(viewCompanyDetail){
            try{
                setLoading(true)
                // @ts-ignore
                await superAdminApi.updateCompanyPlan(viewCompanyDetail.id, data)

                setLoading(false)

                onBack();

                setShowPlanModal(false)

                toastUtils.success('Setting changes saved')
            }catch (e){
                setLoading(false)
                console.log(e.response.data?.message)
                toastUtils.error(e.response.data?.message || "Internal server error")
            }

        }
    }

    const parseDate = (str, format, locale) => {
        const parsed = dateFnsParse(str, format, new Date(), { locale });
        if (DateUtils.isDate(parsed)) {
            return parsed;
        }
        return undefined;
    }
    const formatDate = (date, format, locale) => {
        return dateFnsFormat(date, format, { locale });
    }

    const FORMAT = 'MM/dd/yyyy';

    const onSelectBenefit = (selected) => {
        setPlanDetail({...planDetail, benefitId: selected.value})
    }

    const onSelectStatus = (selected) => {
        setPlanDetail({...planDetail, status: selected.value})
    }

    const onSelectDate = (key, value) => {
        setPlanDetail({...planDetail, [key]: value})
    }

    const updatePlan = () => {
        // @ts-ignore
        const { status, benefitId, endDate } = planDetail
        updateTeamPlan({
            status,
            benefitId,
            endDate,
        })
    }

    const getStatusBadge = (status) => {
        if(status === "active"){
            return <span  className={styles['active-badge']}>{status}</span>
        }

        return <span  className={styles['trial-badge']}>{status}</span>
    }

  return (
    <div className={(styles.container, styles.posRelative)}>
        {!viewCompanyDetail && <>
            <div className={styles.buttons}>
                <SectionButton
                    text='All Users'
                    active={sortData.activeList === 'allUsers'}
                    onClick={() => setSortData(defaultValues)}
                />
                <SectionButton
                    text='All Accounts'
                    active={sortData.activeList === 'allAccounts'}
                    onClick={() => setSortData(companyDefaultSortData)}
                />
            </div>

            {sortData.activeList === 'allUsers' && <UserList />}
            {sortData.activeList === 'allAccounts' && <CompanyList onViewCompanySettings={onViewCompanySettings}/>}
        </>}

        {viewCompanyDetail && <>
            <div className={styles.back} onClick={onBack}>
                <IconClickable src={Utilities.back} />
                <span>Back</span>
            </div>

            <div className={styles.container}>
                <ul className={styles.list}>
                    <li>
                        <div className={styles.row}>
                            <div className={`${styles['name-email']} ${styles['header-title']}`}>
                                <div>
                                    Company Name
                                </div>
                            </div>
                            <div className={`${styles.company} ${styles['header-title']}`}>
                                Account Senior Admin
                            </div>
                            <div className={`${styles.role} ${styles['header-title']}`}>
                                Plan
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className={styles.row}>
                            <div className={`${styles['name-email']}`}>
                                <div>
                                    {viewCompanyDetail?.company}
                                </div>
                            </div>
                            <div className={`${styles.company}`}>
                                <div>
                                    {viewCompanyDetail?.users[0]?.name}
                                </div>
                                <div>
                                    {viewCompanyDetail?.users[0]?.email}
                                </div>
                            </div>
                            <div className={`${styles.role}`}>
                              <p>{viewCompanyDetail?.plan?.name}</p>
                              <p>{getStatusBadge(viewCompanyDetail?.plan?.status)}</p>
                                {viewCompanyDetail?.plan?.endDate && <p>End at {moment(viewCompanyDetail?.plan?.endDate).format("DD/MM/YYYY")}</p>}
                                {/*{viewCompanyDetail?.plan?.renewalDate && <p>Renew at {moment(viewCompanyDetail?.plan?.renewalDate).format("DD/MM/YYYY")}</p>}*/}

                              <Button
                                styleTypes={['exclude-min-height']}
                                type={'button'}
                                text='Edit'
                                styleType='primary'
                                onClick={() => {
                                    setPlanDetail(viewCompanyDetail?.plan)
                                    setShowPlanModal(true)}
                              }
                                disabled={false}
                              />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div className={`${styles['header-title']} m-t-40 m-b-20`}>
                Added Features
            </div>
            <div className={"row align-flex-start"}>
                <div className={"col-20 font-weight-600"}>
                    Vanity Url
                </div>
                <div className={"col-20"}>
                    <OptionList data={type} oneColumn={false} value={vanity} setValue={(value)=>{setVanity(value)}}/>
                </div>
                {vanity && <>
                    <div className={"col-40"}>
                        <label className={styles.label} htmlFor={"link"}>Custom Subdomain Name</label>
                        <Input
                            id={"link"}
                            onChange={(e)=>{setSubdomain(e.target.value)}}
                            value={subdomain}
                            additionalClasses={"font-14"}
                            placeholder={'Link URL'}
                            styleType={'regular-height-short'} />
                    </div>
                </>}

                <div className={"col-20 align-self-flex-end"}>
                    <Button
                        styleTypes={['exclude-min-height']}
                        type={'button'}
                        text='Save'
                        styleType='primary'
                        onClick={() => updateTeam({ vanity, subdomain: vanity ? subdomain.split(".")[0] : ""})}
                        disabled={false}
                    />
                </div>
            </div>

            <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
                <div className={"col-20 font-weight-600"}>
                    CDN Embedding
                </div>

                <div className={"col-20"}>
                    <OptionList setValue={(value) => setCdnAcces(value)} data={type} oneColumn={false} value={cdnAccess }/>
                </div>

                <div className={"col-20 align-self-flex-end"}>
                    <Button
                        styleTypes={['exclude-min-height']}
                        type={'button'}
                        text='Save'
                        styleType='primary'
                        onClick={() => updateTeam({ cdnAccess })}
                    />
                </div>
            </div>

            <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
                <div className={"col-20 font-weight-600"}>
                    Advance Collection Shared Links
                </div>

                <div className={"col-20"}>
                    <OptionList
                        setValue={(value) => setAdvanceShareLink(value)}
                        data={collectionSharedLink}
                        oneColumn={false}
                        value={advancedCollectionShareLink }/>
                </div>

                <div className={"col-20 align-self-flex-end"}>
                    <Button
                        styleTypes={['exclude-min-height']}
                        type={'button'}
                        text='Save'
                        styleType='primary'
                        onClick={() => updateTeam({ advancedCollectionShareLink })}
                    />
                </div>
            </div>
        </>}

        <Base
            modalIsOpen={showPlanModal}
            closeModal={()=>{
                setShowPlanModal(false)
            }}
            additionalClasses={[styles['base-plan-modal']]}
        >
            <div className={styles['plan-modal']}>
                <span className={`${styles.close}`} onClick={() => {setShowPlanModal(false)}}>x</span>
                <div className={styles["form-field"]}>
                    <div className={styles["form-title"]}>Plan</div>
                    <Select
                        options={benefits}
                        additionalClass={'font-weight-normal primary-input-height'}
                        onChange={(selected) => {onSelectBenefit(selected)}}
                        placeholder={`Select the plan`}
                        styleType='regular'
                        value={benefits.filter((benefit)=>benefit.value === planDetail?.benefitId)[0]}
                    />
                </div>

                <div className={styles["form-field"]}>
                    <div className={styles["form-title"]}>Status</div>
                    <Select
                        options={statuses}
                        additionalClass={'font-weight-normal primary-input-height'}
                        onChange={(selected) => {onSelectStatus(selected)}}
                        placeholder={`Status`}
                        styleType='regular'
                        value={statuses.filter((status)=>status.value === planDetail?.status)[0]}
                    />
                </div>

                <div className={`${styles["form-field"]} ${styles['date-wrapper']}`}>
                    <div className={styles["form-title"]}>Expired At</div>
                    <DayPickerInput
                        formatDate={formatDate}
                        format={FORMAT}
                        parseDate={parseDate}
                        onDayChange={(day) => {onSelectDate("endDate", day)}}
                        placeholder={'mm/dd/yyyy'}
                        classNames={{
                            container: dateStyles.input,
                        }}
                        dayPickerProps={{
                            className: dateStyles.calendar
                        }}
                        value={planDetail?.endDate ? new Date(planDetail?.endDate) : ""}
                    />
                </div>

                {/*<div className={`${styles["form-field"]} ${styles['date-wrapper']}`}>*/}
                {/*    <div className={styles["form-title"]}>Reniew At</div>*/}
                {/*    <DayPickerInput*/}
                {/*        formatDate={formatDate}*/}
                {/*        format={FORMAT}*/}
                {/*        parseDate={parseDate}*/}
                {/*        onDayChange={(day) => {onSelectDate("renewalDate", day)}}*/}
                {/*        placeholder={'mm/dd/yyyy'}*/}
                {/*        classNames={{*/}
                {/*            container: dateStyles.input*/}
                {/*        }}*/}
                {/*        dayPickerProps={{*/}
                {/*            className: dateStyles.calendar*/}
                {/*        }}*/}
                {/*        value={planDetail?.renewalDate ? new Date(planDetail?.renewalDate) : ""}*/}
                {/*    />*/}
                {/*</div>*/}

                <div className={"d-flex justify--flex-end"}>
                    <Button
                        styleTypes={['exclude-min-height']}
                        type={'button'}
                        text='Cancel'
                        styleType='secondary'
                        onClick={() => {setShowPlanModal(false)}}
                    />
                    <Button
                        className={"m-l-10"}
                        styleTypes={['exclude-min-height']}
                        type={'button'}
                        text='Save Changes'
                        styleType='primary'
                        onClick={() => {updatePlan()}}
                    />
                </div>


            </div>
        </Base >

        {loading && <SpinnerOverlay />}
    </div>
  )
}

export default SuperAdmin

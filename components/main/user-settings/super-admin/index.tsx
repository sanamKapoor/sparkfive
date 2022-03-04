import styles from './index.module.css'
import { useState } from 'react'

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

const defaultValues = {
    activeList: 'allUsers',
    sortBy: 'users.lastLogin',
    sortDirection: 'ASC'
}

const SuperAdmin = () => {

    const [viewCompanyDetail, setViewCompanyDetail] = useState()
    const [vanity, setVanity] = useState(type[1].value)
    const [subdomain, setSubdomain] = useState('')
    const [loading, setLoading] = useState(false)
    const [sortData, setSortData] = useQueryStrings(defaultValues)

    const onViewCompanySettings =  (data) => {
        setViewCompanyDetail(data)
        setVanity(data.vanity)
        setSubdomain(data.subdomain ? `${data.subdomain || ""}.${window.location.hostname.replace("www.","")}` : "")
    }

    const onBack = () => {
        setViewCompanyDetail(undefined)
    }

    const updateTeam = async() => {
      if(viewCompanyDetail){
          try{
              setLoading(true)
              await superAdminApi.updateCompanyConfig(viewCompanyDetail.id, { vanity, subdomain: vanity ? subdomain.split(".")[0] : ""})

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

  return (
    <div className={styles.container}>
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
                                {viewCompanyDetail?.plan?.name}
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
                        onClick={updateTeam}
                        disabled={false}
                    />
                </div>
            </div>

            <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
                <div className={"col-20 font-weight-600"}>
                    (MOCK) CDN Embedding (MOCK)
                </div>

                <div className={"col-20"}>
                    <OptionList setValue={() => ''} data={type} oneColumn={false} value={false}/>
                </div>

                <div className={"col-20 align-self-flex-end"}>
                    <Button
                        styleTypes={['exclude-min-height']}
                        type={'button'}
                        text='Save'
                        styleType='primary'
                        disabled
                    />
                </div>
            </div>
        </>}

        {loading && <SpinnerOverlay />}
    </div>
  )
}

export default SuperAdmin

import {useEffect, useState} from 'react'

import { Utilities } from '../../../assets'

import styles from './advanced-options.module.css'
import Router from 'next/router'

// Components
import SpinnerOverlay from "../spinners/spinner-overlay";
import IconClickable from "../buttons/icon-clickable";

// APIs
import teamAPI from "../../../server-api/team"

const AdvancedOptions = () => {
    const [loading, setLoading] = useState(false)
    const [autoTagSubFolder, setAutoTagSubFolder] = useState(true)
    const [defaultLandingPage, setDefaultLandingPage] = useState()
    const [collectionSortView, setCollectionSortView] = useState()

    const saveAdvanceConfig = async (config) => {
        setLoading(true)
        await teamAPI.saveAdvanceConfigurations({ config })
        await getAdvanceConfigurations();
    }

    const getAdvanceConfigurations = async () => {
        setLoading(true)
        const { data } = await teamAPI.getAdvanceOptions()
        setAutoTagSubFolder(data.subFolderAutoTag)
        setDefaultLandingPage(data.defaultLandingPage)
        setCollectionSortView(data.collectionSortView)

        setLoading(false)
        return true
    }

    const navigateToDeletedList = (ev) => {
        ev.stopPropagation()
        Router.push('/main/advanced-options/deleted-assets-list')
        return false;
    }

    useEffect(()=>{
        getAdvanceConfigurations();
    },[])

    return (
        <div className={styles['main-wrapper']}>
            <div className={`${styles['row']} ${styles['first-field-block']}`}>
                <div className={`${styles['col-100']}`}>
                    <div className={`${styles['row']}`}>
                        <div className={`${styles['deleted-assets']} row`}>
                            <div className={"col-40"}>
                                <span className={'font-weight-500'}>Deleted Assets</span>
                            </div>
                            <div className={"col-60"}>
                            <a className={`${styles['anchor']}`} href='#' onClick={(ev) => navigateToDeletedList(ev)}>Manage Deleted Assets</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles['row']} ${styles['field-block']}`}>
                <div className={`${styles['col-100']}`}>
                    <div className={`${styles['row']}`}>
                        <div className={`${styles['deleted-assets']} row`}>
                            <div className={"col-40 col-md-100"}>
                                <span className={'font-weight-500'}>Folder Upload Configuration</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={autoTagSubFolder ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({subFolderAutoTag: true})} />
                                            <div className={'font-12 m-l-15'}>Subfolders as Tags (Default)</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={!autoTagSubFolder ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({subFolderAutoTag: false})} />
                                            <div className={'font-12 m-l-15'}>Subfolders as Separate Collections</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles['row']} ${styles['field-block']}`}>
                <div className={`${styles['col-100']}`}>
                    <div className={`${styles['row']}`}>
                        <div className={`${styles['deleted-assets']} row`}>
                            <div className={"col-40 col-md-100"}>
                                <span className={'font-weight-500'}>Default Landing Page</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={defaultLandingPage === 'allTab' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({defaultLandingPage: 'allTab'})} />
                                            <div className={'font-12 m-l-15'}>All Tab</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={defaultLandingPage !== 'allTab' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({defaultLandingPage: 'collection'})} />
                                            <div className={'font-12 m-l-15'}>Collection Tab</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles['row']} ${styles['field-block']}`}>
                <div className={`${styles['col-100']}`}>
                    <div className={`${styles['row']}`}>
                        <div className={`${styles['deleted-assets']} row`}>
                            <div className={"col-40 col-md-100"}>
                                <span className={'font-weight-500'}>Collection Sort View</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={collectionSortView === 'alphabetical' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({collectionSortView: 'alphabetical'})} />
                                            <div className={'font-12 m-l-15'}>Alphabetical</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={collectionSortView !== 'alphabetical' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({collectionSortView: 'newest'})} />
                                            <div className={'font-12 m-l-15'}>Newest</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <SpinnerOverlay />}
        </div>
    )
}

export default AdvancedOptions

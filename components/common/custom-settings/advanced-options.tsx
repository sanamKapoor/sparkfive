import React, { useEffect, useState, useContext } from 'react'
import { Utilities } from '../../../assets'

import styles from './advanced-options.module.css'
import Router from 'next/router'

// Contexts
import { UserContext } from '../../../context'
import { SocketContext } from '../../../context'

// Components
import SpinnerOverlay from "../spinners/spinner-overlay";
import IconClickable from "../buttons/icon-clickable";
import Button from '../buttons/button'

// APIs
import teamAPI from "../../../server-api/team"
import assetAPI from "../../../server-api/asset"

// IMAGE
import rectangeIcon from './rectange.png'

import advancedConfigParams from '../../../utils/advance-config-params'

const AdvancedOptions = () => {
    const [loading, setLoading] = useState(false)
    const { socket, connected, connectSocket } = useContext(SocketContext)

    const [subFolderAutoTag, setSubFolderAutoTag] = useState(true)
    const [defaultLandingPage, setDefaultLandingPage] = useState('')
    const [collectionSortView, setCollectionSortView] = useState('')
    const [duplicateCheck, setDuplicateCheck] = useState(false)
    const [assetSortView, setAssetSortView] = useState('')
    const [searchDefault, setSearchDefault] = useState('')
    const [hideFilterElements, setHideFilterElements] = useState(advancedConfigParams.hideFilterElements)
    const [aiTagging, setaiTagging] = useState(false)
    const { advancedConfig, setAdvancedConfig } = useContext(UserContext)
    const [nonAiTagAssetCount, setNonAiTagAssetCount] = useState(0)
    const [aiTaggingProgress, setAiTaggingProgress] = useState(false)
    const [assetThumbnail, setassetThumbnail] = useState(0)
    const [collectionThumbnail, setcollectionThumbnail] = useState(0)
    const saveAdvanceConfig = async (config) => {
        setLoading(true)
        await teamAPI.saveAdvanceConfigurations({ config })

        const updatedConfig = { ...advancedConfig, ...config }
        setAdvancedConfig(updatedConfig)

        getAdvanceConfigurations(updatedConfig);
    }



    const getAdvanceConfigurations = (conf = advancedConfig) => {
        setSubFolderAutoTag(conf.subFolderAutoTag)
        setDefaultLandingPage(conf.defaultLandingPage)
        setCollectionSortView(conf.collectionSortView)
        setAssetSortView(conf.assetSortView)
        setDuplicateCheck(conf.duplicateCheck)
        setSearchDefault(conf.searchDefault)
        setHideFilterElements(conf.hideFilterElements)
        setaiTagging(conf.aiTagging)
        if (!assetThumbnail) {
            setassetThumbnail(conf.assetThumbnail || 100)
        }
        if (!collectionThumbnail) {
            setcollectionThumbnail(conf.collectionThumbnail || 100)
        }
        setLoading(false)
        return true
    }

    const navigateToDeletedList = (ev) => {
        ev.stopPropagation()
        Router.push('/main/advanced-options/deleted-assets-list')
        return false;
    }

    const toggleHideElementProperty = (prop) => {
        const elemsState = { ...hideFilterElements }
        elemsState[prop] = !elemsState[prop]
        saveAdvanceConfig({ hideFilterElements: elemsState })
    }

    const findNonAiTagAssetCount = async () => {
        const { data: { count } } = await assetAPI.nonAiTagAssetsCount();
        setNonAiTagAssetCount(count)
    }

    const startBulkAiTagging = async () => {
        await assetAPI.startBulkAiTagging();
        setAiTaggingProgress(true)
    }

    useEffect(() => {
        findNonAiTagAssetCount();
    }, [])

    useEffect(() => {
        getAdvanceConfigurations();
    }, [collectionThumbnail])

    // Init socket listener
    useEffect(() => {
        // Socket is available and connected
        if (socket && connected) {
            // Listen upload file process event
            socket.on('BulkAiTaggingProgress', function (data) {
                setNonAiTagAssetCount(data.pendingCount)
                setAiTaggingProgress(true)
            })
        }
    }, [socket, connected])


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
                                                src={subFolderAutoTag ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ subFolderAutoTag: true })} />
                                            <div className={'font-12 m-l-10'}>Subfolders as Tags (Default)</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={!subFolderAutoTag ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ subFolderAutoTag: false })} />
                                            <div className={'font-12 m-l-10'}>Subfolders as Separate Collections</div>
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
                                                onClick={() => saveAdvanceConfig({ defaultLandingPage: 'allTab' })} />
                                            <div className={'font-12 m-l-10'}>All Tab</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={defaultLandingPage !== 'allTab' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ defaultLandingPage: 'collection' })} />
                                            <div className={'font-12 m-l-10'}>Collection Tab</div>
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
                                                onClick={() => saveAdvanceConfig({ collectionSortView: 'alphabetical' })} />
                                            <div className={'font-12 m-l-10'}>Alphabetical</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={collectionSortView !== 'alphabetical' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ collectionSortView: 'newest' })} />
                                            <div className={'font-12 m-l-10'}>Newest</div>
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
                                <span className={'font-weight-500'}>Asset Sort View</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={assetSortView === 'alphabetical' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ assetSortView: 'alphabetical' })} />
                                            <div className={'font-12 m-l-15'}>Alphabetical</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={assetSortView !== 'alphabetical' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ assetSortView: 'newest' })} />
                                            <div className={'font-12 m-l-15'}>Newest</div>
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
                                <span className={'font-weight-500'}>Search Default</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={searchDefault === 'all' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ searchDefault: 'all' })} />
                                            <div className={'font-12 m-l-15'}>All</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={searchDefault === 'tags_only' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ searchDefault: 'tags_only' })} />
                                            <div className={'font-12 m-l-15'}>Tags Only</div>
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
                                <span className={'font-weight-500'}>Duplicate Management</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={"col-40 p-l-r-0"}>
                                            <a className={`${styles['anchor']}`} href='#' onClick={() => { }}>Manage Duplicates</a>
                                        </div>
                                        <div className={'font-12 m-r-15'}>Check Uploads</div>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={duplicateCheck ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ duplicateCheck: true })} />
                                            <div className={'font-12 m-l-10'}>On</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={!duplicateCheck ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => saveAdvanceConfig({ duplicateCheck: false })} />
                                            <div className={'font-12 m-l-10'}>Off (Default)</div>
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
                                <span className={'font-weight-500'}>Hide Filter Elements</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div>
                                    <div className={styles['field-radio-wrapper']}>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                            <IconClickable
                                                src={hideFilterElements.campaigns ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => toggleHideElementProperty('campaigns')} />
                                            <div className={'font-12 m-l-10'}>Campaigns</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15 ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={hideFilterElements.products ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => toggleHideElementProperty('products')} />
                                            <div className={'font-12 m-l-10'}>Products</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15 ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={hideFilterElements.videos ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => toggleHideElementProperty('videos')} />
                                            <div className={'font-12 m-l-10'}>Videos</div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} m-r-15 ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={hideFilterElements.aiTags ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => toggleHideElementProperty('aiTags')} />
                                            <div className={'font-12 m-l-10'}>AI Tags</div>
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
                            <div className={"col-40 col-md-100 d-flex align-items-center"}>
                                <span className={'font-weight-500'}>AI Tagging</span>
                            </div>
                            <div className={"col-60 col-md-100"}>
                                <div className='row'>
                                    {/* <div className={`${styles['field-radio-wrapper']} col-30`}> */}
                                    <div className={`${styles['radio-button-wrapper']} m-r-15`}>
                                        <IconClickable
                                            src={aiTagging ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                            additionalClass={styles['select-icon']}
                                            onClick={() => saveAdvanceConfig({ aiTagging: true })}
                                        />
                                        <div className={'font-12 m-l-10'}>On</div>
                                    </div>
                                    <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                        <IconClickable
                                            src={!aiTagging ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                            additionalClass={styles['select-icon']}
                                            onClick={() => saveAdvanceConfig({ aiTagging: false })} />
                                        <div className={'font-12 m-l-10'}>Off</div>
                                    </div>
                                    {/* </div> */}
                                    {/* <div className='col-70'>
                                        {!aiTaggingProgress && <span className={'font-weight-500 m-b-8'}>Yet {nonAiTagAssetCount} Assets to adapt AI Tagging </span>}
                                        {!aiTaggingProgress && <Button text="Start Bulk Tagging" type='button' styleType='primary' onClick={startBulkAiTagging}/>}
                                        {aiTaggingProgress && <span>Tagging In-progress... <strong>{nonAiTagAssetCount}</strong> remaining</span>}
                                    </div> */}
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
                            <div className={"col-40 col-md-100 d-flex align-items-center"}>
                                <span className={'font-weight-500'}>Thumbnail Size Setting</span>
                            </div>
                            <div className= {`${styles['thumb-size']} col-60 col-md-100 `}>
                                <div className={`${styles['col']}`}>
                                    <div className={`${styles['title-thumb']}`}>Assets Thumbnail size</div>
                                    <div className={`${styles['row']}`}>
                                        {/* <div className={`${styles['field-radio-wrapper']} col-30`}> */}
                                        <div className={`${styles['radio-button-wrapper']}`}>
                                            <IconClickable
                                                src={assetThumbnail == 100 ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => { saveAdvanceConfig({ asset_thumbnail: 100 }); setassetThumbnail(100) }}
                                            />
                                            <div className={`${styles['thumb-val-img']} ${styles['wd-100']} font-12 m-l-10 `}>
                                                <div><img src={rectangeIcon} /></div>
                                                <div>100 %</div>
                                            </div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={assetThumbnail == 75 ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => { saveAdvanceConfig({ asset_thumbnail: 75 }); setassetThumbnail(75) }} />
                                            <div className={`${styles['thumb-val-img']} ${styles['wd-75']} font-12 m-l-10 `}>
                                                <div><img src={rectangeIcon} /></div>
                                                <div>75 %</div>
                                            </div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={assetThumbnail == 50 ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => { saveAdvanceConfig({ asset_thumbnail: 50 }); setassetThumbnail(50) }} />
                                            <div className={`${styles['thumb-val-img']} ${styles['wd-50']} font-12 m-l-10 `} >
                                                <div><img src={rectangeIcon} /></div>
                                                <div>50 %</div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                        {/* <div className='col-70'>
                                        {!aiTaggingProgress && <span className={'font-weight-500 m-b-8'}>Yet {nonAiTagAssetCount} Assets to adapt AI Tagging </span>}
                                        {!aiTaggingProgress && <Button text="Start Bulk Tagging" type='button' styleType='primary' onClick={startBulkAiTagging}/>}
                                        {aiTaggingProgress && <span>Tagging In-progress... <strong>{nonAiTagAssetCount}</strong> remaining</span>}
                                    </div> */}
                                    </div>
                                </div>


                                <div className={`${styles['col']}`}>
                                    <div className={`${styles['title-thumb']}`}>Collection Thubmnail size</div>
                                    <div className={`${styles['row']}`}>
                                        {/* <div className={`${styles['field-radio-wrapper']} col-30`}> */}
                                        <div className={`${styles['radio-button-wrapper']}`}>
                                            <IconClickable
                                                src={collectionThumbnail == 100 ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => { saveAdvanceConfig({ collection_thumbnail: 100 }); setcollectionThumbnail(100) }}
                                            />
                                            <div className={`${styles['thumb-val-img']} ${styles['wd-100']} font-12 m-l-10 `}>
                                                <div><img src={rectangeIcon} /></div>
                                                <div>100 %</div>
                                            </div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={collectionThumbnail == 75 ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => { saveAdvanceConfig({ collection_thumbnail: 75 }); setcollectionThumbnail(75) }} />
                                            <div className={`${styles['thumb-val-img']} ${styles['wd-75']} font-12 m-l-10 `}>
                                                <div><img src={rectangeIcon} /></div>
                                                <div>75 %</div>
                                            </div>
                                        </div>
                                        <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`}>
                                            <IconClickable
                                                src={collectionThumbnail == 50 ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={() => { saveAdvanceConfig({ collection_thumbnail: 50 }); setcollectionThumbnail(50) }} />
                                            <div className={`${styles['thumb-val-img']} ${styles['wd-50']} font-12 m-l-10 `}>
                                                <div><img src={rectangeIcon} /></div>
                                                <div>50 %</div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                        {/* <div className='col-70'>
                                        {!aiTaggingProgress && <span className={'font-weight-500 m-b-8'}>Yet {nonAiTagAssetCount} Assets to adapt AI Tagging </span>}
                                        {!aiTaggingProgress && <Button text="Start Bulk Tagging" type='button' styleType='primary' onClick={startBulkAiTagging}/>}
                                        {aiTaggingProgress && <span>Tagging In-progress... <strong>{nonAiTagAssetCount}</strong> remaining</span>}
                                    </div> */}
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

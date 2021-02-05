import styles from './index.module.css'
import { useState, useContext, useEffect } from 'react'
import { getAssetsFilters, getAssetsSort } from '../../utils/asset'
import toastUtils from '../../utils/toast'
import requestUtils from '../../utils/requests'
import { useRouter } from 'next/router'
import selectOptions from '../common/select-options'
import FilterProvider from '../../context/filter-provider'
import update from 'immutability-helper'
import shareCollectionApi from '../../server-api/share-collection'
import folderApi from '../../server-api/folder'
import { AssetContext, ShareContext } from '../../context'

// Components
import AssetOps from '../common/asset/asset-ops'
import TopBar from '../common/asset/top-bar'
import PasswordOverlay from './password-overlay'
import AssetGrid from '../common/asset/asset-grid'
import SearchOverlay from '../main/search-overlay-assets'
import { DropzoneProvider } from '../common/misc/dropzone'
import FilterContainer from '../common/filter/filter-container'

const DEFAULT_FILTERS = {
    filterCampaigns: [],
    filterChannels: [],
    filterTags: [],
    filterProjects: [],
    filterFileTypes: [],
    filterOrientations: [],
    filterProductFields: [],
    filterProductType: [],
    dimensionWidth: undefined,
    dimensionHeight: undefined,
    beginDate: undefined,
    endDate: undefined
}

const ShareFolderMain = () => {
    const [activeSortFilter, setActiveSortFilter] = useState({
        sort: selectOptions.sort[1],
        mainFilter: 'all',
        ...DEFAULT_FILTERS,
        dimensionsActive: false
    })

    const router = useRouter()

    const {
        assets,
        setAssets,
        setPlaceHolders,
        setActivePageMode,
        needsFetch,
        setNeedsFetch,
        addedIds,
        setAddedIds
    } = useContext(AssetContext)

    const { folderInfo, setFolderInfo } = useContext(ShareContext)

    const [firstLoaded, setFirstLoaded] = useState(false)
    const [activePasswordOverlay, setActivePasswordOverlay] = useState(true)
    const [activeSearchOverlay, setActiveSearchOverlay] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
    const [activeView, setActiveView] = useState('grid')
    const [sharePath, setSharePath] = useState('')

    const submitPassword = async (password) => {
        try {
            const { data } = await folderApi.authenticateCollection({ password, sharePath })
            // Set axios headers
            requestUtils.setAuthToken(data.token, 'share-authorization')
            getFolderInfo(true)
        } catch (err) {
            console.log(err)
            toastUtils.error('Wrong password or invalid link, please try again')
        }
    }

    useEffect(() => {
        const { asPath } = router
        if (asPath) {
            // Get shareUrl from path
            const splitPath = asPath.split('collections/')
            setSharePath(splitPath[1])
        }
    }, [router.asPath])

    useEffect(() => {
        if (sharePath) {
            getFolderInfo()
        }
    }, [sharePath])

    useEffect(() => {
        if (folderInfo && !folderInfo.error) {
            setActivePageMode('library')
            setAssets([])
            getAssets()
        }
    }, [activeSortFilter, folderInfo])

    useEffect(() => {
        if (needsFetch === 'assets') {
            getAssets()
        }
        setNeedsFetch('')
    }, [needsFetch])

    const getFolderInfo = async (displayError = false) => {
        try {
            const { data } = await shareCollectionApi.getFolderInfo({ sharePath })
            setFolderInfo(data)
            setActivePasswordOverlay(false)
        } catch (err) {
            // If not 500, must be auth error, request user password
            if (err.response.status !== 500) {
                setFolderInfo(err.response.data)
                setActivePasswordOverlay(true)
            }
            console.log(err)
            if (displayError) {
                toastUtils.error('Wrong password or invalid link, please try again')
            }
        }
    }

    const clearFilters = () => {
        setActiveSortFilter({
            ...activeSortFilter,
            ...DEFAULT_FILTERS
        })
    }

    const selectAll = () => {
        setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
    }

    const closeSearchOverlay = () => {
        getAssets()
        setActiveSearchOverlay(false)
    }

    const toggleSelected = (id) => {
        const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
        setAssets(update(assets, {
            [assetIndex]: {
                isSelected: { $set: !assets[assetIndex].isSelected }
            }
        }))
    }

    const mapWithToggleSelection = asset => ({ ...asset, toggleSelected })

    const getAssets = async (replace = true) => {
        try {
            if (replace) {
                setAddedIds([])
            }
            setPlaceHolders('asset', replace)
            const { data } = await shareCollectionApi.getAssets({
                ...getAssetsFilters({
                    replace,
                    addedIds,
                    userFilterObject: activeSortFilter
                }),
                ...getAssetsSort(activeSortFilter),
                sharePath
            })
            setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace)
            setFirstLoaded(true)
        } catch (err) {
            //TODO: Handle error
            console.log(err)
        }
    }

    return (
        <FilterProvider isPublic={true} sharePath={sharePath}>
            <main className={styles.container}>
                <TopBar
                    activeSortFilter={activeSortFilter}
                    setActiveSortFilter={setActiveSortFilter}
                    setActiveView={setActiveView}
                    setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
                    selectAll={selectAll}
                    setOpenFilter={setOpenFilter}
                    openFilter={openFilter}
                    isShare={true}
                />
                <div className={`${openFilter && styles['col-wrapper']}`}>
                    <AssetGrid
                        activeView={activeView}
                        activeSortFilter={activeSortFilter}
                        toggleSelected={toggleSelected}
                        mode={'assets'}
                        loadMore={() => getAssets(false)}
                        openFilter={openFilter}
                        isShare={true}
                    />
                    {openFilter &&
                        <FilterContainer
                            clearFilters={clearFilters}
                            openFilter={openFilter}
                            setOpenFilter={setOpenFilter}
                            activeSortFilter={activeSortFilter}
                            setActiveSortFilter={setActiveSortFilter}
                        />
                    }
                </div>
            </main >
            <AssetOps />
            {activePasswordOverlay &&
                <PasswordOverlay
                    onPasswordSubmit={submitPassword}
                    logo={folderInfo?.teamIcon}
                />
            }
            {activeSearchOverlay &&
                <SearchOverlay
                    sharePath={sharePath}
                    closeOverlay={closeSearchOverlay}
                />
            }
        </FilterProvider>
    )
}

export default ShareFolderMain
import styles from './index.module.css'
import { useState, useContext, useEffect } from 'react'
import { getAssetsFilters, getAssetsSort, DEFAULT_FILTERS, DEFAULT_CUSTOM_FIELD_FILTERS } from '../../utils/asset'
import toastUtils from '../../utils/toast'
import requestUtils from '../../utils/requests'
import { useRouter } from 'next/router'
import update from 'immutability-helper'
import shareCollectionApi from '../../server-api/share-collection'
import folderApi from '../../server-api/folder'
import { AssetContext, ShareContext, FilterContext } from '../../context'

// Components
import AssetOps from '../common/asset/asset-ops'
import TopBar from '../common/asset/top-bar'
import PasswordOverlay from './password-overlay'
import AssetGrid from '../common/asset/asset-grid'
import SearchOverlay from '../main/search-overlay-assets'
import FilterContainer from '../common/filter/filter-container'

const ShareFolderMain = () => {
    const router = useRouter()

    const {
        assets,
        setAssets,
        setPlaceHolders,
        setActivePageMode,
        needsFetch,
        setNeedsFetch,
        addedIds,
        setAddedIds,
        nextPage,
        selectAllAssets,
        setFolders,
        activeFolder,
        setActiveFolder
    } = useContext(AssetContext)

    const { folderInfo, setFolderInfo } = useContext(ShareContext)

    const { activeSortFilter, setActiveSortFilter, setSharePath: setContextPath } = useContext(FilterContext)

    const [firstLoaded, setFirstLoaded] = useState(false)
    const [activePasswordOverlay, setActivePasswordOverlay] = useState(true)
    const [activeSearchOverlay, setActiveSearchOverlay] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
    const [activeView, setActiveView] = useState('grid')
    const [sharePath, setSharePath] = useState('')
    const [activeMode, setActiveMode] = useState('assets')

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

    const getFolders = async (replace = true) => {
        try {
            setActiveFolder("")

            if (replace) {
                setAddedIds([])
            }
            setPlaceHolders('folder', replace)
            const {field, order} = activeSortFilter.sort
            const queryParams = { page: replace ? 1 : nextPage,  sortField: field, sortOrder: order, sharePath}

            if (!replace && addedIds.length > 0) {
                // @ts-ignore
                queryParams.excludeIds = addedIds.join(',')
            }
            if (activeSortFilter.filterFolders?.length > 0) {
                // @ts-ignore
                queryParams.folders = activeSortFilter.filterFolders.map(item => item.value).join(',')
            }
            const { data } = await shareCollectionApi.getFolders(queryParams)

            let assetList = { ...data, results: data.results }
            // if (lastUploadedFolder && activeSortFilter.mainFilter === "folders" && activeSortFilter.sort.value === "alphabetical") {
            //     const lastFolder = {...lastUploadedFolder}
            //     assetList.results.unshift(lastFolder)
            // }

            setFolders(assetList, replace)
        } catch (err) {
            //TODO: Handle error
            console.log(err)
        }
    }

    const setInitialLoad = async () => {
        if (!firstLoaded) {
            setFirstLoaded(true)

            let sort = {...activeSortFilter.sort}

            // setActiveSortFilter({
            //     ...activeSortFilter,
            //     mainFilter: "folders",
            //     sort
            // })
        }
    }

    useEffect(() => {
        const { asPath } = router
        if (asPath) {
            // Get shareUrl from path
            const splitPath = asPath.split('collections/')
            setSharePath(splitPath[1])
            setContextPath(splitPath[1])
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

    useEffect(() => {
        setInitialLoad();


        if (firstLoaded) {
            setActivePageMode('library')
            if (activeSortFilter.mainFilter === 'folders') {
                setActiveMode('folders')
                getFolders()
            } else {
                setActiveMode('assets')
                setAssets([])
                getAssets()
            }
        }
    }, [activeSortFilter])

    useEffect(() => {
        if (firstLoaded && activeFolder !== '') {
            setActiveSortFilter({
                ...activeSortFilter,
                mainFilter: 'all'
            })
        }

    }, [activeFolder])

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
            ...DEFAULT_FILTERS,
            ...DEFAULT_CUSTOM_FIELD_FILTERS(activeSortFilter)
        })
    }

    const selectAll = () => {
        // Mark select all
        selectAllAssets()

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
                    nextPage,
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

    const loadMore = () => {
        if (activeMode === 'assets') {
            getAssets(false)
        } else {
            getFolders(false)
        }
    }

    const viewFolder = async (id) => {
        setActiveFolder(id)
    }

    return (
        <>
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
                        activeFolder={activeFolder}
                        getFolders={getFolders}
                        activeView={activeView}
                        activeSortFilter={activeSortFilter}
                        toggleSelected={toggleSelected}
                        isShare={true}
                        mode={activeMode}
                        viewFolder={viewFolder}
                        loadMore={loadMore}
                        openFilter={openFilter}
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
        </>
    )
}

export default ShareFolderMain

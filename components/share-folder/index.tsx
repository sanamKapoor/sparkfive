import styles from './index.module.css'
import { useState, useContext } from 'react'
import selectOptions from '../common/select-options'
import { AssetContext } from '../../context'

// Components
import TopBar from '../common/top-bar/top-bar'

const ShareFolderMain = () => {

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

    const [activeSortFilter, setActiveSortFilter] = useState({
        sort: selectOptions.sort[1],
        mainFilter: 'all',
        ...DEFAULT_FILTERS,
        dimensionsActive: false
    })

    const {
        assets,
        setAssets,
        activeFolder,
    } = useContext(AssetContext)

    const [activeSearchOverlay, setActiveSearchOverlay] = useState(false)

    const [openFilter, setOpenFilter] = useState(false)

    const [activeView, setActiveView] = useState('grid')

    const selectAll = () => {
        setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
      }

    return (
        <main className={styles.container}>
            <TopBar
                activeSortFilter={activeSortFilter}
                setActiveSortFilter={setActiveSortFilter}
                activeView={activeView}
                setActiveView={setActiveView}
                activeFolder={activeFolder}
                setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
                selectAll={selectAll}
                setOpenFilter={setOpenFilter}
                openFilter={openFilter}
            />
        </main >
    )
}

export default ShareFolderMain
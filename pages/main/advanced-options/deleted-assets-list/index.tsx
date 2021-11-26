import Head from 'next/head'

import FilterProvider from '../../../../context/filter-provider'
import { ASSET_ACCESS } from '../../../../constants/permissions'

// Components
import MainLayout from '../../../../components/common/layouts/main-layout'

import DeletedAssetsLibrary from '../../../../components/common/custom-settings/deleted-assets'
import { useContext } from 'react'
import { UserContext } from '../../../../context'
import NoPermissionNotice from '../../../../components/common/misc/no-permission-notice'
import LoginPage from '../../../login'

const AssetsPage = () => {

    const {user} = useContext(UserContext)
    return <FilterProvider>
        <Head>
            <title>User Settings</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
            {user ?
                ((user.roleId === 'admin' || user.roleId === 'super_admin') ? <DeletedAssetsLibrary /> : <NoPermissionNotice />)
                :
                <LoginPage />
            }
            
        </MainLayout>
    </FilterProvider>
}

export default AssetsPage

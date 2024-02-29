import styles from './main.module.css'
import { useState } from 'react'

// Components
import SectionButton from '../../common/buttons/section-button'
import TagManagement from "./tag-management";
import CampaignManagement from "./campaign-management";
import CustomFieldsManagement from "./custom-fields-management"
import ProductManagment from "./product-management";
import CollectionManagement from "./collection-management";

const Main = () => {
    const [activeList, setActiveList] = useState('tags')

    return (
        <>
            <div className={styles.buttons}>
                <SectionButton
                    text='Tags'
                    active={activeList === 'tags'}
                    onClick={() => setActiveList('tags')}
                />
                <SectionButton
                    text='Campaigns'
                    active={activeList === 'campaigns'}
                    onClick={() => setActiveList('campaigns')}
                />
                <SectionButton
                    text='Custom Fields'
                    active={activeList === 'customFields'}
                    onClick={() => setActiveList('customFields')}
                />
                {/*<SectionButton*/}
                {/*    text='Products'*/}
                {/*    active={activeList === 'products'}*/}
                {/*    onClick={() => setActiveList('products')}*/}
                {/*/>*/}

                <SectionButton
                    text='Collections'
                    active={activeList === 'collections'}
                    onClick={() => setActiveList('collections')}
                />
            </div>

            {activeList === 'tags' && <TagManagement />}
            {activeList === 'campaigns' && <CampaignManagement />}
            {activeList === 'customFields' && <CustomFieldsManagement />}
            {/*{activeList === 'products' && <ProductManagment />}*/}
            {activeList === 'collections' && <CollectionManagement />}
        </>
    )
}

export default Main

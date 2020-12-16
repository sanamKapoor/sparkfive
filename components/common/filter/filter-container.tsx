import styles from './filter-container.module.css'
import update from 'immutability-helper'
import { useState, useEffect } from 'react'

// Components
import FilterSelector from './filter-selector'


const FilterContainer = () => {

    const [expandedMenus, setExpandedMenus] = useState(['tags', 'channels', 'campaigns'])

    const tags = [

        {
            name: 'Women',
            total: '25'
        },
        {
            name: 'men',
            total: '15'
        },
        {
            name: 'fall',
            total: '34'
        },
        {
            name: 'winter',
            total: '3'
        },
        {
            name: 'summer',
            total: '2'
        },
        {
            name: 'spring',
            total: '18'
        },
    ]
    const channels = [

        {
            name: 'email',
            total: '55'
        },
        {
            name: 'Facebook',
            total: '65'
        },
        {
            name: 'Ads',
            total: '2'
        },
        {
            name: 'Twitter',
            total: '78'
        }
    ]
    const campaigns = [

        {
            name: 'black friday 2020',
            total: '55'
        },
        {
            name: 'valentines day 2020',
            total: '65'
        },
        {
            name: 'holiday 2020',
            total: '2'
        },
        {
            name: 'Twitter',
            total: '78'
        }
    ]
    const projects = [

        {
            name: 'project test 1',
            total: '3'
        },
        {
            name: 'project test 2',
            total: '23'
        },
        {
            name: 'project test 3',
            total: '32'
        },
        {
            name: 'Tproject test 4',
            total: '44'
        },
        {
            name: 'Tproject test 5',
            total: '44'
        },
        {
            name: 'Tproject test 6',
            total: '44'
        }
    ]
    const fileTypes = [
        {
            name: 'jpg',
            total: '3'
        },
        {
            name: 'pdf',
            total: '23'
        },
        {
            name: 'png',
            total: '32'
        },
        {
            name: 'doc',
            total: '44'
        },
    ]

    const handleExpand = (menu) => {
        let index = expandedMenus.findIndex((item) => item === menu)
        if(index !== -1 ){
            setExpandedMenus(update(expandedMenus, {
                $splice: [[index, 1]]
            }))
        }else {
            setExpandedMenus(update(expandedMenus, {
                $push: [menu]
            }))
        }
    }

    return (
        <div className={`${styles.container}`}>
            <section className={styles['top-bar']}>
                <h3>Filters</h3>
                <div className={`${styles.clear}`}>
                    <p>Clear</p>
                    <div>&#10005;</div>
                </div>
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('tags')}>
                    <h4>Tags</h4>
                    {expandedMenus.includes('tags') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('tags') && <FilterSelector filters={tags} numItems={10} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('channels')}>
                    <h4>Channels</h4>
                    {expandedMenus.includes('channels') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('channels') && <FilterSelector searchBar={false} filters={channels} numItems={8} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('campaigns')}>
                    <h4>Campaigns</h4>
                    {expandedMenus.includes('campaigns') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('campaigns') && <FilterSelector filters={campaigns} oneColumn={true} numItems={5} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('projects')}>
                    <h4>Projects</h4>
                    {expandedMenus.includes('projects') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('projects') && <FilterSelector filters={projects} oneColumn={true} numItems={5} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('file-types')}>
                    <h4>File Types</h4>
                    {expandedMenus.includes('file-types') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('file-types') && <FilterSelector filters={fileTypes} numItems={5} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('product')}>
                    <h4>Product</h4>
                    {expandedMenus.includes('product') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('product') && <FilterSelector filters={fileTypes} numItems={5} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('date')}>
                    <h4>Date Uploaded</h4>
                    {expandedMenus.includes('date') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('date') && <FilterSelector filters={fileTypes} numItems={5} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('orientation')}>
                    <h4>Orientation</h4>
                    {expandedMenus.includes('orientation') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('orientation') && <FilterSelector filters={fileTypes} numItems={5} />}
            </section>
            <section>
                <div className={styles['expand-bar']} onClick={() => handleExpand('dimensions')}>
                    <h4>Dimensions</h4>
                    {expandedMenus.includes('dimensions') ? <div className={styles['expand-icon']}>&#8743;</div> : <div className={styles['expand-icon']}>&#8744;</div>}
                </div>
                {expandedMenus.includes('dimensions') && <FilterSelector filters={fileTypes} numItems={5} />}
            </section>
        </div>

    )
}

export default FilterContainer

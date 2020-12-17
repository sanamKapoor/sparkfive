import styles from './product-filter.module.css'
import { useState, useEffect } from 'react'
import Select from '../../common/inputs/select'

// Components

const ProductFilter = () => {

    const fieldOptions = [
        {
            label: 'category1',
            value: 'category1'
        },
        {
            label: 'category2',
            value: 'category2'
        },
        {
            label: 'category3',
            value: 'category3'
        },
        {
            label: 'category4',
            value: 'category4'
        },
        {
            label: 'category5',
            value: 'category5'
        }
    ]
    const valueOptions = [
        {
            label: 'women jackects',
            value: 'women jackects'
        },
        {
            label: 'Hats',
            value: 'hats'
        },
        {
            label: 'Sandals',
            value: 'sandals'
        },
        {
            label: 'Shirts',
            value: 'shirts'
        }
    ]

    const [productSelected, setProductlected] = useState('')
    const [valueSelected, setValueSelected] = useState('')

    const hadleProductSelected = (value) => {
        setProductlected(value)
    }
    const hadleValueSelected = (value) => {
        setValueSelected(value)
    }
    
    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.field}`}>
                <h5>Field</h5>
                <Select
                    options={fieldOptions}
                    value={productSelected}
                    styleType='filter filter-schedule'
                    onChange={(selected) => hadleProductSelected(selected)}
                    placeholder='Select Product'
                />
            </div>
            <div className={`${styles.field}`}>
                <h5>Value</h5>
                <Select
                    options={valueOptions}
                    value={valueSelected}
                    styleType='filter filter-schedule'
                    onChange={(selected) => hadleValueSelected(selected)}
                    placeholder='Select Value'
                />
            </div>
        </div>

    )
}

export default ProductFilter



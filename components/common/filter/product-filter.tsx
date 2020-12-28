import styles from './product-filter.module.css'
import { useState, useEffect } from 'react'
import Select from '../../common/inputs/select'
import productFields from '../../../resources/data/product-fields.json'

// Components

const ProductFilter = ({ loadFn, productFilters, setSortFilterValue, typeValue, fieldsValue }) => {

    useEffect(() => {
        loadFn()
    }, [])

    let valueFilters = []
    if (typeValue.value === 'product_category') valueFilters = productFilters.categories
    if (typeValue.value === 'product_vendor') valueFilters = productFilters.vendors
    if (typeValue.value === 'product_retailer') valueFilters = productFilters.retailers

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.field}`}>
                <h5>Field</h5>
                <Select
                    options={productFields.map((field) => ({ ...field, label: `Product ${field.label}` }))}
                    value={typeValue}
                    styleType='filter select-filter'
                    onChange={(selected) => setSortFilterValue('filterProductType', selected)}
                    placeholder='Select Product Field'
                />
            </div>
            <div className={`${styles.field}`}>
                <h5>Value</h5>
                <Select
                    options={valueFilters}
                    value={fieldsValue}
                    styleType='filter select-filter'
                    onChange={(selected) => setSortFilterValue('filterProductFields', selected)}
                    placeholder='Select Value'
                />
            </div>
        </div>

    )
}

export default ProductFilter



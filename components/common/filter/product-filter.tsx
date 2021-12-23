import styles from './product-filter.module.css'
import { useState, useEffect } from 'react'
import Select from '../../common/inputs/select'
import productFields from '../../../resources/data/product-fields.json'

const ProductFilter = ({ loadFn, productFilters, setSortFilterValue, fieldsValue, skuValue }) => {

    const [typeValue, setType] = useState(null)

    useEffect(() => {
        loadFn()
    }, [])

    useEffect(() => {
        if (typeValue)
            setSortFilterValue('filterProductFields', null)
    }, [typeValue])

    let valueFilters = []
    if (typeValue?.value === 'product_category') valueFilters = productFilters.categories
    if (typeValue?.value === 'product_vendor') valueFilters = productFilters.vendors
    if (typeValue?.value === 'product_retailer') valueFilters = productFilters.retailers

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.field} product-select`}>
                <h5>Sku</h5>
                <Select
                    options={productFilters.sku.map((field) => ({ ...field, value: field.sku, label: field.sku }))}
                    value={skuValue}
                    isMulti={true}
                    styleType='regular'
                    onChange={(selected) => setSortFilterValue('filterProductSku', selected)}
                    placeholder='Select Value'
                />
            </div>
            <div className={`${styles.field} product-select`}>
                <h5>Field</h5>
                <Select
                    options={productFields.map((field) => ({ ...field, label: `Product ${field.label}` }))}
                    value={typeValue}
                    styleType='regular'
                    onChange={(selected) => setType(selected)}
                    placeholder='Select Product Field'
                />
            </div>
            <div className={`${styles.field} product-select`}>
                <h5>Value</h5>
                <Select
                    options={valueFilters.map((value => ({ ...value, label: value.name, value: value.id })))}
                    value={fieldsValue}
                    isMulti={true}
                    styleType='regular'
                    onChange={(selected) => setSortFilterValue('filterProductFields', selected)}
                    placeholder='Select Value'
                />
            </div>
        </div>

    )
}

export default ProductFilter



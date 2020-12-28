import styles from './product-addition.module.css'
import { useState, useEffect } from 'react'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'
import ReactSelect from 'react-select'
import { Utilities } from '../../../assets'
import productApi from '../../../server-api/product'
import assetApi from '../../../server-api/asset'
import tagApi from '../../../server-api/tag'

// Components
import IconClickable from '../buttons/icon-clickable'

const ProductAddition = ({
  FieldWrapper,
  isShare,
  activeDropdown,
  setActiveDropdown,
  assetId,
  updateAssetState,
  product
}) => {

  const [inputProducts, setInputProducts] = useState([])
  const [inputCategories, setInputCategories] = useState([])
  const [inputVendors, setInputVendors] = useState([])
  const [inputRetailers, setInputRetailers] = useState([])

  useEffect(() => {
    // Get input data
    getData(productApi.getProducts(), setInputProducts)
    getData(tagApi.getTags({ type: 'product_category' }), setInputCategories)
    getData(tagApi.getTags({ type: 'product_vendor' }), setInputVendors)
    getData(tagApi.getTags({ type: 'product_retailer' }), setInputRetailers)
  }, [])

  const getData = async (asyncDataFn, setFn) => {
    try {
      const { data } = await asyncDataFn
      setFn(data)
    } catch (err) {
      console.log(err)
    }
  }

  const onValueChange = (selected, actionMeta, createFn, changeFn) => {
    if (actionMeta.action === 'create-option') {
      createFn(selected.value)
    } else {
      changeFn(selected)
    }
  }

  const addProduct = async (productSku) => {
    try {
      const sku = productSku
      const { data: newProduct } = await assetApi.addProduct(assetId, { sku })
      updateAssetState({
        productId: { $set: newProduct.id }
      })
      setInputProducts(update(inputProducts, { $push: [newProduct] }))
    } catch (err) {
      console.log(err)
    }
  }

  const changeProduct = (selected) => {
    updateAssetState({
      productId: { $set: selected.value },
      product: { $set: selected }
    })
  }

  const ProductProperty = ({ label, value }) => (
    <div>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  )

  let valueInput

  return (
    <FieldWrapper>
      <div className={`secondary-text ${styles.field}`}>Product</div>
      <div className={'normal-text'}>
        {product?.sku}
        {!isShare &&
          <>
            {activeDropdown === 'sku' ?
              <div className={`tag-select ${styles['select-wrapper']}`}>
                <ReactCreatableSelect
                  options={inputProducts.map(product => ({ ...product, label: product.sku, value: product.id }))}
                  placeholder={'Enter new SKU or select an existing one'}
                  onChange={(selected, actionMeta) => onValueChange(selected, actionMeta, addProduct, changeProduct)}
                  styleType={'regular item'}
                  menuPlacement={'top'}
                  isClearable={true}
                />
              </div>
              :
              <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('sku')}>
                <IconClickable src={Utilities.add} />
                <span>Add SKU</span>
              </div>
            }

          </>
        }
      </div>
      {product &&
        <div className={'normal-text'}>
          {product.vendor && <ProductProperty label={'Vendor'} value={product.vendor.name} />}
          {product.retailer && <ProductProperty label={'Retailer'} value={product.retailer.name} />}
          {product.category && <ProductProperty label={'Category'} value={product.category.name} />}
          {!isShare &&
            <>
              {activeDropdown === 'product_field' ?
                <div className={`tag-select ${styles['select-wrapper']}`}>
                  <ReactSelect
                    options={inputProducts.map(product => ({ ...product, label: product.sku, value: product.id }))}
                    placeholder={'Select Field'}
                    onChange={(selected, actionMeta) => onValueChange(selected, actionMeta, addProduct, changeProduct)}
                    styleType={'regular item'}
                    menuPlacement={'top'}
                    isClearable={true}
                  />
                </div>
                :
                <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('product_field')}>
                  <IconClickable src={Utilities.add} />
                  <span>Add Field</span>
                </div>
              }
              {activeDropdown === 'product_value' &&
                <div className={`tag-select ${styles['select-wrapper']}`}>
                  <ReactCreatableSelect
                    options={inputProducts.map(product => ({ ...product, label: product.sku, value: product.id }))}
                    placeholder={'Enter new value or select an existing one'}
                    onChange={(selected, actionMeta) => onValueChange(selected, actionMeta, addProduct, changeProduct)}
                    styleType={'regular item'}
                    menuPlacement={'top'}
                    isClearable={true}
                  />
                </div>
              }
            </>
          }
        </div>
      }
    </FieldWrapper>
  )
}

export default ProductAddition

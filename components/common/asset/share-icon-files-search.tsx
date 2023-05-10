import React, {useContext, useRef, useState} from "react";
import Search from "../attributes/search-input";

import styles from "./asset-related-files-search.module.css"

import assetApi from "../../../server-api/asset";
import AssetImg from "./asset-img";
import AssetIcon from "./asset-icon";
import Button from "../buttons/button";

// Contexts
import { LoadingContext, TeamContext } from '../../../context'

export default function ShareIconFilesSearch({ onSelect = (asset) => {}, logo = {} }){
    const { setIsLoading } = useContext(LoadingContext)
    const { team } = useContext(TeamContext)

    const [options, setOptions] = useState([])
    const [searching, setSearching] = useState(false)
    const [showList, setShowList] = useState(false)
    const [selectedLogo, setSelectedLogo] = useState("")

    const fileBrowserRef = useRef(undefined)

    const search = async (value) => {
        if(value || showList){
            const queryParams = {
                term: value,
                page: 1,
                onlyLogo: 1
            };
            try {
                setShowList(true);
                setSearching(true);

                const {data} = await assetApi.searchAssets(queryParams);
                if(data.results){
                    setOptions(data.results)
                }else{
                    setOptions([])
                }

                setSearching(false);
            }catch (e){
                setSearching(false);
            }
        }
    }

    const onClear = () => {
        setSearching(false);
        setShowList(false);
    }

    const onSelectItem = (asset) => {
        setSearching(false);
        setShowList(false);

        console.log(asset)

        onSelect(asset)
        setSelectedLogo(asset)
    }

    const onFilesDataGet = async (file) => {
        const formData = new FormData()

        // Append file to form data
        formData.append('asset', file)
        formData.append('fileModifiedAt', new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString())

        let { data } = await assetApi.uploadAssets(formData,{estimateTime: 1, size: file.size, totalSize: file.size})

        onSelect(data[0].asset)
    }

    const onFileChange = async (e) => {
        setIsLoading(true)
        onFilesDataGet(e.target.files[0])
    }


    return <div className={styles.container}>
        <input id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
               accept="image/png, image/svg"
               onChange={onFileChange} />
        <Search placeholder={"Find logo via name"} onChange={search} onClear={onClear} onlyInput={true} styleType={styles["search-input"]} inputContainerStyle={styles["search-input-container"]} nonIcon/>

        {showList && <div className={styles["search-results"]}>
            { searching && <div className={styles["search-loading"]}>
                Searching ....
            </div>}
            {!searching && options.map(({asset, thumbailUrl}, index)=>{
                const selectedAssetInfo = {...asset, thumbailUrl}
                return  <div className={styles["search-item"]} key={index} onClick={()=>{onSelectItem(selectedAssetInfo)}}>
                    <div className={styles["search-item-thumbnail"]}>
                        {thumbailUrl ? (
                            <AssetImg
                                assetImg={thumbailUrl}
                                type={asset.type}
                                name={asset.name}
                            />
                        ) : (
                            <AssetIcon noMargin extension={asset.extension} onList={true} />
                        )}
                        {/*<img src={thumbailUrl} alt={"thumbnail"}/>*/}
                    </div>
                    <div>
                        {asset.name}
                    </div>

                </div>
            })}

            {!searching && options.length === 0 && <div className={styles["search-loading"]}>
              No result
            </div>}
        </div>}

        <div className={"row m-t-30"}>
            <div className={"col-25"}>
                <img src={logo?.thumbailUrl || team?.workspaceIcon} className={`${styles["thumbnail-image"]} ${styles["thumbnail-image-50"]}` }/>
            </div>
            <div className={"col-75"}>
                <div>Image must be minimum 300x200px</div>
                <div>Must be transparent. Valid formats are png or svg</div>
                <Button
                    className={"m-t-10"}
                    text={"Upload Logo"}
                    onClick={() => {
                        fileBrowserRef.current.click()
                    }}
                    type='button'
                    styleType='primary'
                />
            </div>
        </div>
    </div>
}

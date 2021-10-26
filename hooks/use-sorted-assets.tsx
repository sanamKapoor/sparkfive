import { Dispatch, useEffect, useState } from "react";
import dateCompare from "../utils/date-compare";

export default function useSortedAssets(assets): [any[], string, any] {
    const [sortedAssets, setSortedAssets] = useState([])
    const [currentSortAttribute, setCurrentSortAttribute] = useState('')

    useEffect(() => {
        setSortedAssets(assets)
    }, [assets])

    useEffect(() => {
        if (!currentSortAttribute) {
            setSortedAssets(assets)
            return
        }
        const newSortedAssets = [...assets]
        switch (currentSortAttribute) {
            case 'asset.name':
                newSortedAssets.sort((a, b) => a.asset.name.localeCompare(b.asset.name))
                break
            case 'asset.type':
                newSortedAssets.sort((a, b) => a.asset.type.localeCompare(b.asset.type))
                break
            case 'asset.extension':
                newSortedAssets.sort((a, b) => a.asset.extension.localeCompare(b.asset.extension))
                break
            case 'asset.size':
                newSortedAssets.sort((a, b) => parseInt(a.asset.size) - parseInt(b.asset.size))
                break
            case 'asset.created-at':
                newSortedAssets.sort((a, b) => dateCompare(a.asset.createdAt, b.asset.createdAt))
                break
            case 'folder.name':
                newSortedAssets.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'folder.length':
                newSortedAssets.sort((a, b) => a.length - b.length)
                break
            case 'folder.created-at':
                newSortedAssets.sort((a, b) => dateCompare(a.createdAt, b.createdAt))
                break
        }
        setSortedAssets(newSortedAssets)
    }, [currentSortAttribute, assets])

    return [sortedAssets, currentSortAttribute, setCurrentSortAttribute]
}
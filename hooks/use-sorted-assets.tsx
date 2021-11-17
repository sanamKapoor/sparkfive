import { useEffect, useState } from "react";
import dateCompare from "../utils/date-compare";

export default function useSortedAssets(assets): [any[], string, any] {
    const [sortedAssets, setSortedAssets] = useState([])
    const [currentSortAttribute, setCurrentSortAttribute] = useState('')

    useEffect(() => {
        setSortedAssets(assets)
    }, [assets])

    let direction = 1
    let currentSortAttributeType = currentSortAttribute
    if (currentSortAttribute.startsWith("-")) {
        currentSortAttributeType = currentSortAttribute.substring(1)
        direction = -1
    }

    useEffect(() => {
        if (!currentSortAttribute) {
            setSortedAssets(assets)
            return
        }
        const newSortedAssets = [...assets]
        switch (currentSortAttributeType) {
            case 'asset.name':
                newSortedAssets.sort((a, b) => a.asset.name.localeCompare(b.asset.name) * direction)
                break
            case 'asset.type':
                newSortedAssets.sort((a, b) => a.asset.type.localeCompare(b.asset.type) * direction)
                break
            case 'asset.extension':
                newSortedAssets.sort((a, b) => a.asset.extension.localeCompare(b.asset.extension) * direction)
                break
            case 'asset.size':
                newSortedAssets.sort((a, b) => (parseInt(a.asset.size) - parseInt(b.asset.size)) * direction)
                break
            case 'asset.created-at':
                newSortedAssets.sort((a, b) => dateCompare(a.asset.createdAt, b.asset.createdAt) * direction)
                break
            case 'asset.deleted-at':
                newSortedAssets.sort((a, b) => dateCompare(a.asset.deletedAt, b.asset.deletedAt) * direction)
                break
            case 'folder.name':
                newSortedAssets.sort((a, b) => a.name.localeCompare(b.name) * direction)
                break
            case 'folder.length':
                newSortedAssets.sort((a, b) => (a.length - b.length) * direction)
                break
            case 'folder.created-at':
                newSortedAssets.sort((a, b) => dateCompare(a.createdAt, b.createdAt) * direction)
                break
        }
        setSortedAssets(newSortedAssets)
    }, [currentSortAttribute, assets])

    return [sortedAssets, currentSortAttribute, setCurrentSortAttribute]
}
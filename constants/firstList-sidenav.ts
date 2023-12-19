import { Utilities } from '../assets';


export const sideNavFirstList = [
    {
        icon: Utilities.assets,
        description: 'All Assets',
        name: 'all',
        countValue: "allAsset",
        hiddenKeyName: 'all'
    },
    {
        icon: Utilities.vedio,
        description: 'Video',
        name: 'videos',
        countValue: 'video',
        hiddenKeyName: 'videos'
    },
    {
        icon: Utilities.images,
        description: 'Images',
        name: 'images',
        countValue: "image",
        hiddenKeyName: 'images'
    },
    {
        icon: Utilities.product,
        description: 'Product',
        name: 'product',
        countValue: "", // Replace with the actual count if available
        hiddenKeyName: 'products'
    },
    {
        icon: Utilities.archive,
        description: 'Archived',
        name: 'archived',
        countValue: "", // Replace with the actual count if available
        hiddenKeyName: 'archived'
    },
]

import permission from "../constants/permissions";

export default {
  sort: [
    {
      label: 'None',
      value: 'none'
    },
    {
      label: 'Newest',
      value: 'newest',
      field: 'createdAt',
      order: 'desc'
    },
    {
      label: 'Oldest',
      value: 'oldest',
      field: 'createdAt',
      order: 'asc'
    },
    {
      label: 'Alphabetical',
      value: 'alphabetical',
      field: 'name',
      order: 'asc'
    },
    {
      label: 'File Size',
      value: 'size',
      field: 'size',
      order: 'desc'
    }
  ],

  views: [
    {
      text: 'Collections',
      name: 'folders',
      omitFolder: true,
      omitShare: false,
      requirePermissions: [],
      hideOnSingle: true,
    },
    {
      text: 'All',
      name: 'all',
      requirePermissions: []
    },
    {
      text: 'Images',
      name: 'images',
      requirePermissions: []
    },
    {
      text: 'Products',
      name: 'product',
      requirePermissions: []
    },
    {
      text: 'Videos',
      name: 'videos',
      requirePermissions: []
    },
    {
      text: 'Archived',
      name: 'archived',
      omitFolder: true,
      omitShare: true,
      requirePermissions: [permission.ASSET_EDIT]
    },
    {
      text: 'SubCollction',
      name: 'subCollction',
      omitFolder: true,
      omitShare: false,
      requirePermissions: [],
    }
  ],

  channels: [
    {
      label: 'Email',
      value: 'email'
    },
    {
      label: 'Social',
      value: 'social'
    },
    {
      label: 'Ads',
      value: 'ads'
    },
    {
      label: 'Articles',
      value: 'articles'
    },
    {
      label: 'Banners',
      value: 'banners'
    }
  ]
}

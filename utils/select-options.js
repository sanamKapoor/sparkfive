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
    },
    {
      label: 'Newest',
      value: 'newest',
      field: 'deletedAt',
      order: 'desc'
    },
    {
      label: 'Oldest',
      value: 'oldest',
      field: 'deletedAt',
      order: 'asc'
    }
  ],

  views: [
    {
      text: 'Collections',
      name: 'folders',
      omitFolder: true,
      omitShare: true,
      requirePermissions: []
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

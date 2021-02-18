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
      omitShare: true
    },
    {
      text: 'All',
      name: 'all',
    },
    {
      text: 'Images',
      name: 'images'
    },
    {
      text: 'Products',
      name: 'product'
    },
    {
      text: 'Videos',
      name: 'videos'
    },
    {
      text: 'Archived',
      name: 'archived',
      omitFolder: true,
      omitShare: true
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
export const navItems = [
    {
        name: 'Dashboard',
        icon: '/assets/icons/dashboard.svg',
        href: '/'
    },
    {
        name: 'Documents',
        icon: '/assets/icons/documents.svg',
        href: '/documents'
    },
    {
        name: 'Images',
        icon: '/assets/icons/images.svg',
        href: '/images'
    },
    {
        name: 'Media',
        icon: '/assets/icons/video.svg',
        href: '/media'
    },
    {
        name: 'Others',
        icon: '/assets/icons/others.svg',
        href: '/others'
    },

]


export const actionsDropdownItems = [
    {
      label: 'Rename',
      icon: '/assets/icons/edit.svg',
      value: 'rename',
    },
    {
      label: 'Details',
      icon: '/assets/icons/info.svg',
      value: 'details',
    },
    {
      label: 'Share',
      icon: '/assets/icons/share.svg',
      value: 'share',
    },
    {
      label: 'Download',
      icon: '/assets/icons/download.svg',
      value: 'download',
    },
    {
      label: 'Delete',
      icon: '/assets/icons/delete.svg',
      value: 'delete',
    },
  ];

  export const sortTypes = [
    {
      label: 'Date created (newest)',
      value: '$createdAt-desc',
    },
    {
      label: 'Created Date (oldest)',
      value: '$createdAt-asc',
    },
    {
      label: 'Name (A-Z)',
      value: 'name-asc',
    },
    {
      label: 'Name (Z-A)',
      value: 'name-desc',
    },
    {
      label: 'Size (Highest)',
      value: 'size-desc',
    },
    {
      label: 'Size (Lowest)',
      value: 'size-asc',
    },
  ];
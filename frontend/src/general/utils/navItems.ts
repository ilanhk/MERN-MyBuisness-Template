export interface NavItem {
  name: string;
  path: string;
  dropdown?: NavItem[]; // Optional for dropdown items
};

export const navItemsNoProducts: NavItem[] = [
  { name: 'Company', path: '/about', dropdown: [
    { name: 'About us', path: '/about' },
    { name: 'Services', path: '/service' },
    { name: 'Careers', path: '/job' },
    { name: 'Contact us', path: '/contact' }
  ] 
},
];

export const navItemsWithProducts: NavItem[] = [
  { name: 'Products', path: '/product' },
  { name: 'Company', path: '/about', dropdown: [
      { name: 'About us', path: '/about' },
      { name: 'Services', path: '/service' },
      { name: 'Careers', path: '/job' },
      { name: 'Contact us', path: '/contact' }
    ] 
  }
];


export const adminItemsNoProducts: NavItem = { name: 'Admin', path: '/admin', dropdown: [
  { name: 'Users', path: '/admin/userlist' },
  { name: 'Jobs', path: '/admin/joblist' },
  { name: 'Edit Website', path: '/admin/edit/homepage' },
  ] 
};


export const adminItemsWithProducts: NavItem = { name: 'Admin', path: '/admin', dropdown: [
  { name: 'Users', path: '/admin/userlist' },
  { name: 'Products', path: '/admin/productlist'},
  { name: 'Jobs', path: '/admin/joblist' },
  { name: 'Edit Website', path: '/admin/edit/homepage' },
  ] 
};


export const navItemsForEditingExample = [
  { name: 'Products' },
  { name: 'Company', dropdown: [
    { name: 'About us' },
    { name: 'Contact us' }
  ] 
},
];


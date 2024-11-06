export interface NavItem {
  name: string;
  path: string;
  dropdown?: NavItem[]; // Optional for dropdown items
};

export const navItems: NavItem[] = [
  { name: 'Products', path: '/product' },
  { name: 'Company', path: '/about', dropdown: [
      { name: 'About us', path: '/about' },
      { name: 'Services', path: '/service' },
      { name: 'Careers', path: '/job' },
      { name: 'Contact us', path: '/contact' }
    ] 
  }
];

export const adminItems: NavItem = { name: 'Admin', path: '/admin', dropdown: [
  { name: 'Users', path: '/admin/userlist' },
  { name: 'Products', path: '/admin/productlist'},
  { name: 'Jobs', path: '/admin/job' },
  { name: 'Analytics', path: '/admin/analytics' },
  { name: 'Edit pages', path: '/admin/editpages' },
  ] 
};


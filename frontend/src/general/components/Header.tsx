import React, { useEffect, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import { navItemsNoProducts, navItemsWithProducts, adminItemsNoProducts, adminItemsWithProducts} from '../utils/navItems';
import { useSelectAuth } from '../../features/auth/state/hooks';
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import { CompanyInfoState } from '../../features/company/companyInfo/state/slice';
import CompanyLogo from './CompanyLogo';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

const Header: React.FC = () => {
  const auth = useSelectAuth();
  const companyInfo = useSelectCompanyInfo() as CompanyInfoState;
  const { hasProducts } = companyInfo.company.companyType;

  // Initialize navItems and adminItems as arrays
  let navItems;
  let adminItems;

  // Set navItems and adminItems based on companyInfo
  if (hasProducts) {
    navItems = navItemsWithProducts;
    adminItems = adminItemsWithProducts;
  } else {
    navItems = navItemsNoProducts;
    adminItems = adminItemsNoProducts;
  }

  const [navItemsList, setNavItemsList] = useState(navItems);

  useEffect(() => {
    // Combine navItems and adminItems based on auth state
    const navItemsWithAdminItems = navItems.concat(adminItems);

    // Update navItemsList based on auth state
    if (auth.isEmployee) {
      setNavItemsList(navItemsWithAdminItems);
    } else {
      setNavItemsList(navItems);
    }
  }, [auth?.isEmployee, navItems, adminItems]);  // Only use navItems and adminItems as dependencies

  return (
    <nav className="navbar">
      <div className="logo-container">
        <CompanyLogo />
      </div>
      <ul className="navbar-list">
        {navItemsList.map((item, index) => (
          <li key={index} className="navbar-item">
            <Link to={item.path}>{item.name}</Link>
            {item.dropdown && (
              <ul className="dropdown-menu">
                {item.dropdown.map((dropdownItem, dropdownIndex) => (
                  <li key={dropdownIndex} className="dropdown-item">
                    <Link to={dropdownItem.path}>{dropdownItem.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li className="user-button">
          {auth.firstName ? <ProfileButton /> : <LoginButton />}
        </li>
      </ul>
    </nav>
  );
};

export default memo(Header);

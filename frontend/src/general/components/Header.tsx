import React, { useEffect, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import { navItems, adminItems, NavItem } from '../utils/navItems';
import { useSelectAuth } from '../../features/auth/state/hooks';
import CompanyLogo from './CompanyLogo';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

const Header: React.FC = () => {
  const auth = useSelectAuth();
  const navItemsWithAdminItems: NavItem[] = navItems.concat(adminItems);
  const [navItemsList, setNavItemsList] = useState(navItems);

  useEffect(() => {
    if (auth.isEmployee) {
      setNavItemsList(navItemsWithAdminItems);
    } else{
      setNavItemsList(navItems);
    }; 
  }, [auth?.isEmployee]);

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
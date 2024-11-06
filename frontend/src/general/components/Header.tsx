import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import { navItems, adminItems , NavItem } from '../utils/navItems';
import { useSelectAuth } from '../../features/auth/state/hooks';
import CompanyLogo from './CompanyLogo';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

const Header: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [navItemsState, setNavItemsState] = useState<NavItem[]>(navItems);
  const auth = useSelectAuth()


  useEffect(()=>{
    const adminExists = navItems.findIndex((item)=> item.name === 'Admin')
    console.log(adminItems.name, adminExists)
    if (auth.isEmployee && adminExists === -1) {
      navItems.push(adminItems);
      setNavItemsState(navItems);
      setDropdownVisible(null);
    };
  },[auth?.isEmployee]);

  const handleMouseEnter = (index: number) => {
    setDropdownVisible(index);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(null);
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <CompanyLogo />
      </div>
      <ul className="navbar-list">
        
        {navItemsState.map((item, index) => (
          <li
            key={index}
            className="navbar-item"
            onMouseEnter={() => item.dropdown && handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Link to={item.path}>{item.name}</Link>
            {item.dropdown && dropdownVisible === index && (
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

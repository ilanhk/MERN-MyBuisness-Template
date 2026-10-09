import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import { navItemsNoProducts, navItemsWithProducts, adminItemsNoProducts, adminItemsWithProducts } from '../utils/navItems';
import { useSelectAuth } from '../../features/auth/state/hooks';
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import CompanyLogo from './CompanyLogo';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';
const Header = () => {
    const auth = useSelectAuth();
    const companyInfo = useSelectCompanyInfo();
    const { hasProducts } = companyInfo.company.companyType;
    // Initialize navItems and adminItems as arrays
    let navItems;
    let adminItems;
    // Set navItems and adminItems based on companyInfo
    if (hasProducts) {
        navItems = navItemsWithProducts;
        adminItems = adminItemsWithProducts;
    }
    else {
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
        }
        else {
            setNavItemsList(navItems);
        }
    }, [auth === null || auth === void 0 ? void 0 : auth.isEmployee, navItems, adminItems]); // Only use navItems and adminItems as dependencies
    return (_jsxs("nav", { className: "navbar", children: [_jsx("div", { className: "logo-container", children: _jsx(CompanyLogo, {}) }), _jsxs("ul", { className: "navbar-list", children: [navItemsList.map((item, index) => (_jsxs("li", { className: "navbar-item", children: [_jsx(Link, { to: item.path, children: item.name }), item.dropdown && (_jsx("ul", { className: "dropdown-menu", children: item.dropdown.map((dropdownItem, dropdownIndex) => (_jsx("li", { className: "dropdown-item", children: _jsx(Link, { to: dropdownItem.path, children: dropdownItem.name }) }, dropdownIndex))) }))] }, index))), _jsx("li", { className: "user-button", children: auth.firstName ? _jsx(ProfileButton, {}) : _jsx(LoginButton, {}) })] })] }));
};
export default memo(Header);

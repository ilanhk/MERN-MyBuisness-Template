import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import '../css/EditingCompanySideBar.css';
const EditingCompanySideBar = () => {
    return (_jsxs("div", { className: "sidebar-container", children: [_jsx("h2", { className: "sidebar-title", children: "Edit Settings" }), _jsx("nav", { className: "sidebar", children: _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: "/admin/edit/company-info", children: "Company Information" }) }), _jsx("li", { children: _jsx(Link, { to: "/admin/edit/website-styles", children: "Website Styling" }) }), _jsx("li", { children: _jsx(Link, { to: "/admin/edit/homepage", children: "Home Page" }) }), _jsx("li", { children: _jsx(Link, { to: "/admin/edit/aboutpage", children: "About us Page" }) }), _jsx("li", { children: _jsx(Link, { to: "/admin/edit/services", children: "Services Page" }) }), _jsx("li", { children: _jsx(Link, { to: "/admin/edit/contactpage", children: "Contact us Page" }) })] }) })] }));
};
export default EditingCompanySideBar;

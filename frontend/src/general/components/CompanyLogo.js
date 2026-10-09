import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { memo } from 'react';
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import '../css/companyLogo.css';
const CompanyLogo = () => {
    var _a;
    const companyInfo = useSelectCompanyInfo();
    const logoImage = (_a = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.company) === null || _a === void 0 ? void 0 : _a.logoImage;
    return (_jsx(Link, { to: "/", children: logoImage ? (_jsx("img", { className: 'logo-image', src: logoImage, alt: "Company Logo" })) : (_jsxs("div", { className: 'company-logo', children: [_jsx(BsFillSuitcaseLgFill, { className: 'logo-image' }), "MyBusiness"] })) }));
};
export default memo(CompanyLogo);

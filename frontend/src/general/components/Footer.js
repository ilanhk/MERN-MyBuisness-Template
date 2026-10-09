import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import '../css/footer.css';
import CompanyLogo from './CompanyLogo';
import SocialMediaSection from './SocialMediaSection';
const Footer = ({ year }) => {
    const companyInfo = useSelectCompanyInfo();
    const { hasProducts } = companyInfo.company.companyType;
    const [hasProductz, setHasProductz] = useState(false);
    useEffect(() => {
        if (hasProducts) {
            setHasProductz(true);
        }
        else {
            setHasProductz(false);
        }
    }, [hasProducts]);
    return (_jsxs("footer", { className: "business-footer", children: [_jsxs("div", { className: 'footer-logo-and-socials', children: [_jsx(CompanyLogo, {}), _jsx(SocialMediaSection, {})] }), _jsxs("div", { className: 'footer-menu', children: [hasProductz && _jsx("h4", { children: "Products " }), _jsx("h4", { children: "Company " }), _jsx("h4", { children: "Get in touch " })] }), _jsx("div", { className: "footer-divider" }), _jsx("div", { className: 'footer-copyright', children: _jsxs("p", { children: ["\u00A9 ", year || new Date().getFullYear(), " My Website. All rights reserved."] }) })] }));
};
export default Footer;

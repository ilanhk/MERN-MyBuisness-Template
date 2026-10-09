import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FaLinkedin, FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaAmazon, } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiAliexpress } from "react-icons/si";
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import '../css/socialMediaSection.css';
const SocialMediaSection = () => {
    var _a, _b;
    const companyInfo = useSelectCompanyInfo();
    const socialMedia = (_b = (_a = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.contactUs) === null || _a === void 0 ? void 0 : _a.socialMedia) !== null && _b !== void 0 ? _b : {};
    const { linkedin, facebook, instagram, twitter, tiktok, youtube, amazon, aliexpress } = socialMedia;
    return (_jsx("div", { className: 'social-media-section', children: !socialMedia ? (_jsx("a", { href: "https://www.linkedin.com/in/ilan-lieberman-9a1043132/", target: "_blank", rel: "noopener noreferrer", children: _jsx(FaLinkedin, { className: 'icon-linkedin' }) })) : (_jsxs(_Fragment, { children: [linkedin && (_jsx("a", { href: linkedin, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaLinkedin, { className: 'icon icon-linkedin' }) })), facebook && (_jsx("a", { href: facebook, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaFacebook, { className: 'icon icon-facebook' }) })), instagram && (_jsx("a", { href: instagram, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaInstagram, { className: 'icon icon-instagram' }) })), twitter && (_jsx("a", { href: twitter, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaSquareXTwitter, { className: 'icon icon-twitter' }) })), tiktok && (_jsx("a", { href: tiktok, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaTiktok, { className: 'icon icon-tiktok' }) })), youtube && (_jsx("a", { href: youtube, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaYoutube, { className: 'icon icon-youtube' }) })), amazon && (_jsx("a", { href: amazon, target: "_blank", rel: "noopener noreferrer", children: _jsx(FaAmazon, { className: 'icon icon-amazon' }) })), aliexpress && (_jsx("a", { href: aliexpress, target: "_blank", rel: "noopener noreferrer", children: _jsx(SiAliexpress, { className: 'icon icon-aliexpress' }) }))] })) }));
};
export default SocialMediaSection;

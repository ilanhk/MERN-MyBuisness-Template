import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import OvalButton from './OvalButton';
import '../css/heroBlock.css';
const HeroBlock = () => {
    var _a;
    const companyInfo = useSelectCompanyInfo();
    const info = (_a = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.home) === null || _a === void 0 ? void 0 : _a.valueProposition;
    console.log('hero block company info: ', companyInfo);
    const { proposition, callToAction, image } = info || {};
    return (_jsxs("div", { className: 'hero-block-container', children: [_jsxs("div", { className: 'hero-block-info', children: [_jsx("h2", { className: 'hero-title', children: proposition || 'Our value proposition goes here' }), _jsx("p", { className: 'hero-text', children: callToAction || 'Get Started with Us' }), _jsx(OvalButton, { path: '/contact', text: 'Get started' })] }), _jsx("img", { className: 'hero-block-image', src: image || 'https://paulcollege.unh.edu/sites/default/files/styles/landscape_480x260/public/landing-page/header-image/2018/marketing-dept-tom-gruen-paul-college1920x475.jpg?h=2a536532&itok=HXpy1_Cd' })] }));
};
export default HeroBlock;

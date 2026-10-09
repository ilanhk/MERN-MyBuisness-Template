import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelectCompanyInfo } from './companyInfo/state/hooks';
import './css/about-us.css';
const AboutUsScreen = () => {
    const companyInfoArray = useSelectCompanyInfo();
    const info = companyInfoArray === null || companyInfoArray === void 0 ? void 0 : companyInfoArray.about;
    // Check if info exists before destructuring
    const { title, description, image } = info || {};
    console.log('about image: ', image);
    return (_jsxs("div", { className: "about-us", children: [_jsx("h2", { className: "about-title", children: title }), _jsx("img", { src: image || '/path/to/default-image.jpg', alt: "about the company" }), _jsx("p", { className: "about-text", children: description })] }));
};
export default AboutUsScreen;

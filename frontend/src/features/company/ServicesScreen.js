import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelectCompanyInfo } from "./companyInfo/state/hooks";
import { fakeservices } from "../../general/utils/fakeData";
import './css/services.css';
const ServicesScreen = () => {
    const companyInfoArray = useSelectCompanyInfo();
    const info = companyInfoArray === null || companyInfoArray === void 0 ? void 0 : companyInfoArray.services;
    const { title, description } = info || {};
    return (_jsxs("div", { className: "services-page", children: [_jsx("h2", { children: title }), _jsx("p", { children: description }), fakeservices.map((service, index) => (_jsxs("div", { className: "service-block", children: [_jsx("img", { className: "service-image", src: service.image }), _jsxs("div", { className: "service-info", children: [_jsx("h2", { className: "service-title", children: service.name }), _jsx("p", { className: "service-description", children: service.description })] })] }, index)))] }));
};
export default ServicesScreen;

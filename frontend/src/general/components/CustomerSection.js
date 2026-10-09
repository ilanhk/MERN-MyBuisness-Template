import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
const CustomerSection = () => {
    var _a;
    const companyInfoArray = useSelectCompanyInfo();
    const info = (_a = companyInfoArray === null || companyInfoArray === void 0 ? void 0 : companyInfoArray.home) === null || _a === void 0 ? void 0 : _a.customerSection;
    const { title, description } = info || {};
    return (_jsxs("div", { children: [_jsx("h3", { children: title }), _jsx("p", { children: description }), _jsx("h4", { children: "Customer Carasol Big customers we done business" }), _jsx("h4", { children: "Customer testimonials" })] }));
};
export default CustomerSection;

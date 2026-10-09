import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelectCompanyInfo } from "./companyInfo/state/hooks";
import SocialMediaSection from "../../general/components/SocialMediaSection";
const ContactUsScreen = () => {
    const companyInfoArray = useSelectCompanyInfo();
    const info = companyInfoArray === null || companyInfoArray === void 0 ? void 0 : companyInfoArray.contactUs;
    const { title, description, email, phone, address } = info;
    return (_jsxs("div", { children: [_jsx("h2", { children: title }), _jsx("p", { children: description }), _jsx("div", { children: _jsx("h3", { children: "To make an Order:" }) }), _jsxs("div", { children: [_jsx("h3", { children: "For further inquiries:" }), _jsx("p", { children: "Email section" }), _jsx("p", { children: "Schedule a zoom or google meet with reason why" })] }), _jsxs("div", { children: [_jsx("p", { children: "map" }), _jsx("p", { children: "addess" }), _jsx("p", { children: "phone and fax" })] }), _jsxs("div", { children: [_jsx("h3", { children: "Follow us here: " }), _jsx(SocialMediaSection, {})] })] }));
};
export default ContactUsScreen;

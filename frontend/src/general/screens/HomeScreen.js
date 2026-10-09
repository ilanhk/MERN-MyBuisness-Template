import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeroBlock from "../components/HeroBlock";
import CustomerSection from "../components/CustomerSection";
import { useSelectCompanyInfo } from "../../features/company/companyInfo/state/hooks";
const HomeScreen = () => {
    const companyInfo = useSelectCompanyInfo();
    const { hasProducts, isEcommerce } = companyInfo.company.companyType;
    return (_jsxs("div", { children: [_jsx(HeroBlock, {}), hasProducts && _jsx("h3", { children: "Carosel of categories with top products" }), isEcommerce && _jsx("h3", { children: "Carosel of Deals or Best selling Products" }), _jsx("h3", { children: "Services section" }), _jsx(CustomerSection, {}), _jsx("h3", { children: "Call to action button" })] }));
};
export default HomeScreen;

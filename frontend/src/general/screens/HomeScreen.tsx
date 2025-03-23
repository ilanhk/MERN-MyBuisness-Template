import HeroBlock from "../components/HeroBlock";
import CustomerSection from "../components/CustomerSection";
import { useSelectCompanyInfo } from "../../features/company/companyInfo/state/hooks";



const HomeScreen = () => {
  const companyInfo = useSelectCompanyInfo();
  const { hasProducts, isEcommerce } = companyInfo.company.companyType;
  return (
    <div>
      <HeroBlock />
      {hasProducts && <h3>Carosel of categories with top products</h3>}
      {isEcommerce && <h3>Carosel of Deals or Best selling Products</h3>}
      <CustomerSection />
      
      
      
      <h3>Call to action button</h3>
      <h3>Call to action button</h3>
      <h3>Call to action button</h3>
     

    </div>
  )
};

export default HomeScreen;

// https://www.youtube.com/watch?v=p5LIqg-oNbs -idead to put on site

import { useEffect, useState } from 'react';
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import '../css/footer.css';
import CompanyLogo from './CompanyLogo';
import SocialMediaSection from './SocialMediaSection';



interface FooterProps {
  year?: number; // Example of a prop (e.g., current year)
}

const Footer: React.FC<FooterProps> = ({ year }) => {

  const companyInfo = useSelectCompanyInfo();

  const { hasProducts } = companyInfo.company.companyType;
  const [ hasProductz, setHasProductz ] = useState(false)

  useEffect(()=>{
    if(hasProducts){
      setHasProductz(true)
    }else{
      setHasProductz(false)
    }
  }, [hasProducts])
  return (
    <footer className="business-footer">
      <div className='footer-logo-and-socials'>
        <CompanyLogo />
        <SocialMediaSection />
      </div>
      <div className='footer-menu'>
        {hasProductz && <h4>Products </h4>}
        <h4>Company </h4>
        <h4>Get in touch </h4>
      </div>

      <div className="footer-divider"></div>

      <div className='footer-copyright'>
      <p>© {year || new Date().getFullYear()} My Website. All rights reserved.</p>
      </div>
     
    </footer>
  );
};

export default Footer;
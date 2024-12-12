import { Link } from 'react-router-dom';
import { memo } from 'react';
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import '../css/companyLogo.css';

const CompanyLogo = () => {
  const companyInfo = useSelectCompanyInfo();
  const logoImage = companyInfo?.company?.logoImage;

  return (
    <Link to="/">
      {logoImage ? (
        <img className='logo-image' src={logoImage} alt="Company Logo" />
      ) : (
        <div className='company-logo'>
          <BsFillSuitcaseLgFill className='logo-image' />
          MyBusiness
        </div>
      )}
    </Link>
  );
};

export default memo(CompanyLogo);

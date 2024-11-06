import { Link } from 'react-router-dom';
import { memo } from 'react';
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import '../css/companyLogo.css';

const CompanyLogo = () => {
  return (
    <Link to="/">
          <div className='company-logo'>
            <BsFillSuitcaseLgFill  className='logo-image'/>
            MyBusiness
          </div>
    </Link>
  )
}

export default memo(CompanyLogo);
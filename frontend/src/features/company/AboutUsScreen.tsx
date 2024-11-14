import { useSelectCompanyInfo } from './companyInfo/state/hooks';
import './css/about-us.css';

const AboutUsScreen = () => {
  const companyInfoArray = useSelectCompanyInfo();
  const info = companyInfoArray?.about;

  
  // Check if info exists before destructuring
  const { title, description, image } = info || {};

  return (
    <div className="about-us">
      <h2 className="about-title">{title}</h2>
      <img src={image} alt="about the company" />
      <p className="about-text">{description}</p>
    </div>
  )
};

export default AboutUsScreen;
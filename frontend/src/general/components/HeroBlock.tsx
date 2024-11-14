import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import OvalButton from './OvalButton';
import '../css/heroBlock.css';


const HeroBlock = () => {
  const companyInfoArray = useSelectCompanyInfo();
  const info = companyInfoArray?.home?.valueProposition;

  const { proposition, callToAction } = info || {};

  return (
    <div className='hero-block'>
      <h2 className='hero-title'>{proposition}</h2>
      <p className='hero-text'>{callToAction}</p>
      <OvalButton path='/contact' text='Get started' />
    </div>
  );
};

export default HeroBlock;

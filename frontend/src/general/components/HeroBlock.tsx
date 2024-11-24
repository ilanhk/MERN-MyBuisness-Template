import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import OvalButton from './OvalButton';
import '../css/heroBlock.css';


const HeroBlock = () => {
  const companyInfo = useSelectCompanyInfo();
  const info = companyInfo?.home?.valueProposition;
  console.log('hero block company info: ', companyInfo)

  const { proposition, callToAction } = info || {};

  return (
    <div className='hero-block'>
      <h2 className='hero-title'>{proposition || 'Our value proposition goes here'}</h2>
      <p className='hero-text'>{callToAction || 'Get Started with Us'}</p>
      <OvalButton path='/contact' text='Get started' />
    </div>
  );
};

export default HeroBlock;

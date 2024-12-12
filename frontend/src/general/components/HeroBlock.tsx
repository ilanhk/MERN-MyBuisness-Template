import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import OvalButton from './OvalButton';
import '../css/heroBlock.css';


const HeroBlock = () => {
  const companyInfo = useSelectCompanyInfo();
  const info = companyInfo?.home?.valueProposition;
  console.log('hero block company info: ', companyInfo)

  const { proposition, callToAction, image } = info || {};

  return (
    <div className='hero-block-container'>
      <div className='hero-block-info'>
        <h2 className='hero-title'>{proposition || 'Our value proposition goes here'}</h2>
        <p className='hero-text'>{callToAction || 'Get Started with Us'}</p>
        <OvalButton path='/contact' text='Get started' />
      </div>
      <img className='hero-block-image' src={image || 'https://paulcollege.unh.edu/sites/default/files/styles/landscape_480x260/public/landing-page/header-image/2018/marketing-dept-tom-gruen-paul-college1920x475.jpg?h=2a536532&itok=HXpy1_Cd'} />
    </div>
  );
};

export default HeroBlock;

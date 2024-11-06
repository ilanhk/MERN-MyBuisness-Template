import '../css/heroBlock.css';
import OvalButton from './OvalButton';

interface HeroBlockProps {
  title: string;
  text: string;
};

const HeroBlock = ({title, text}: HeroBlockProps) => {
  return (
    <div className='hero-block'>
      <h2 className='hero-title'>{title}</h2>
      <p className='hero-text'>{text}</p>
      <OvalButton path='/contact' text='Get started'/>
    </div>
  )
}

export default HeroBlock
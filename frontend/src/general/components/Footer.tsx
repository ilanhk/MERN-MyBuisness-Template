import { 
  FaLinkedin, 
  FaFacebook, 
  FaInstagram, 
  FaXTwitter, 
  FaTiktok, 
  FaYoutube, 
  FaAmazon, 
  FaAliexpress 
} from 'react-icons/fa';
import '../css/footer.css';
import CompanyLogo from './CompanyLogo';


interface FooterProps {
  year?: number; // Example of a prop (e.g., current year)
}

const Footer: React.FC<FooterProps> = ({ year }) => {
  return (
    <footer className="business-footer">
      <div className='footer-logo-and-socials'>
        <CompanyLogo />
        <a href="https://www.linkedin.com/in/ilan-lieberman-9a1043132/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className='footer-icon' />
        </a>
      </div>
      <div className='footer-menu'>
        <h4>Products </h4>
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
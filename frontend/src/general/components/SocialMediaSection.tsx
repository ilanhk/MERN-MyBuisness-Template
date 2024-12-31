import { 
  FaLinkedin, 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaAmazon, 
} from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiAliexpress } from "react-icons/si";
import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';
import '../css/socialMediaSection.css';


const SocialMediaSection = () => {
  const companyInfo = useSelectCompanyInfo();
  const socialMedia = companyInfo?.contactUs?.socialMedia ?? {};
  const { linkedin, facebook, instagram, twitter, tiktok, youtube, amazon, aliexpress} = socialMedia;

  return (
    <div className='social-media-section'>
      {!socialMedia ? (
        <a href="https://www.linkedin.com/in/ilan-lieberman-9a1043132/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className='icon-linkedin' />
        </a>
      ) : (
        <>
          { linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className='icon icon-linkedin' />
            </a>
          )}

          { facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook className='icon icon-facebook' />
            </a>
          )}

          { instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className='icon icon-instagram' />
            </a>
          )}

          { twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer">
              <FaSquareXTwitter className='icon icon-twitter' />
            </a>
          )}

          { tiktok && (
            <a href={tiktok} target="_blank" rel="noopener noreferrer">
              <FaTiktok className='icon icon-tiktok' />
            </a>
          )}

          { youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer">
              <FaYoutube className='icon icon-youtube' />
            </a>
          )}

          { amazon && (
            <a href={amazon} target="_blank" rel="noopener noreferrer">
              <FaAmazon className='icon icon-amazon' />
            </a>
          )}

          { aliexpress && (
            <a href={aliexpress} target="_blank" rel="noopener noreferrer">
              <SiAliexpress className='icon icon-aliexpress' />
            </a>
          )}
        </>
      )}
    </div>
  )
};

export default SocialMediaSection;
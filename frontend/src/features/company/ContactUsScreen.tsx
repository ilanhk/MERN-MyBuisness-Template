import { useSelectCompanyInfo } from "./companyInfo/state/hooks";
import SocialMediaSection from "../../general/components/SocialMediaSection";


const ContactUsScreen = () => {
  const companyInfoArray = useSelectCompanyInfo();
  const info = companyInfoArray?.contactUs;
  const { title, description, email, phone, address} = info;
  
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <h3>To make an Order:</h3>
      </div>
      <div>
        <h3>For further inquiries:</h3>
        <p>Email section</p>
        <p>Schedule a zoom or google meet with reason why</p>
      </div>
      <div>
        <p>map</p>
        <p>addess</p>
        <p>phone and fax</p>
      </div>
      <div>
        <h3>Follow us here: </h3>
        <SocialMediaSection />
      </div>
    </div>
  )
};

export default ContactUsScreen;
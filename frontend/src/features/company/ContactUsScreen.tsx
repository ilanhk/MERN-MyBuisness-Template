import { useSelectCompanyInfo } from "./companyInfo/state/hooks";


const ContactUsScreen = () => {
  const companyInfoArray = useSelectCompanyInfo();
  const info = companyInfoArray?.contactUs;
  const { title, description, email, phone, address} = info;
  
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <h3>google meet booking tool??</h3>
      <h3>Live chat too?</h3>
      <h3>sign up to our newsletters</h3>
    </div>
  )
};

export default ContactUsScreen;
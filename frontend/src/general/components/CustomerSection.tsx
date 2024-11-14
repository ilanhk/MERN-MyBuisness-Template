import { useSelectCompanyInfo } from '../../features/company/companyInfo/state/hooks';

const CustomerSection = () => {
  const companyInfoArray = useSelectCompanyInfo();
  const info = companyInfoArray?.home?.customerSection;
  const { title, description } = info || {};

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <h4>Customer Carasol Big customers we done business</h4>
      <h4>Customer testimonials</h4>
    </div>
  )
}

export default CustomerSection

import { useSelectCompanyInfo } from "./companyInfo/state/hooks";
import { fakeservices } from "../../general/utils/fakeData";
import './css/services.css';

const ServicesScreen = () => {
  const companyInfoArray = useSelectCompanyInfo();
  const info = companyInfoArray?.services;

  const { title, description } = info || {};

  return (
    <div className="services-page">
      <h2>{title}</h2>
      <p>{description}</p>
      { fakeservices.map((service, index)=>(
        <div key={index} className="service-block">
          <img className="service-image" src={service.image} />
          <div className="service-info">
            <h2 className="service-title">{service.name}</h2>
            <p className="service-description">{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
};

export default ServicesScreen;
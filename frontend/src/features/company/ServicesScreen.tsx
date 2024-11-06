import { fakeservices } from "../../general/utils/fakeData";
import './css/services.css';

const ServicesScreen = () => {
  return (
    <div className="services-page">
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
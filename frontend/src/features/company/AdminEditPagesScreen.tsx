import { useState } from "react";
import AdminEditCompanyInfo from "./companyInfo/edit-pages-screens/AdminEditCompanyInfo";
import AdminEditWebsiteStyles from "./companyInfo/edit-pages-screens/AdminEditWebsiteStyles";
import AdminEditHomePage from "./companyInfo/edit-pages-screens/AdminEditHomePage";
import AdminEditAboutUs from "./companyInfo/edit-pages-screens/AdminEditAboutUs";
import AdminEditServices from "./companyInfo/edit-pages-screens/AdminEditServices";
import AdminEditContactUs from "./companyInfo/edit-pages-screens/AdminEditContactUs";


const AdminEditPagesScreen = () => {
  const [screen, setScreen ] = useState('home');
  return (
    <div className="profile-container">
      <div className="profile-menu">
        <h3>Edit Website</h3>
        <p onClick={() => setScreen('companyInfo')}>Company Information</p>
        <p onClick={() => setScreen('webStyles')}>Website Styling</p>
        <p onClick={() => setScreen('home')}>Home Page</p>
        <p onClick={() => setScreen('about')}>About us Page</p>
        <p onClick={() => setScreen('services')}>Services Page</p>
        <p onClick={() => setScreen('contact')}>Contact us Page</p>
      </div>
      { screen === 'companyInfo' ? (<AdminEditCompanyInfo />) :
      screen === 'webStyles' ? (<AdminEditWebsiteStyles />) :
      screen === 'home' ? (<AdminEditHomePage />) : 
        screen === 'about' ? (<AdminEditAboutUs />) :
        screen === 'services' ? (<AdminEditServices />) : 
        (<AdminEditContactUs />)}
    </div>
  )
};

export default AdminEditPagesScreen;
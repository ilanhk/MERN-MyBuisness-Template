import { useState } from "react";
import AdminEditHomePage from "./edit-pages-screens/AdminEditHomePage";
import AdminEditAboutUs from "./edit-pages-screens/AdminEditAboutUs";
import AdminEditServices from "./edit-pages-screens/AdminEditServices";
import AdminEditContactUs from "./edit-pages-screens/AdminEditContactUs";

const AdminEditPagesScreen = () => {
  const [screen, setScreen ] = useState('home');
  return (
    <div className="profile-container">
      <div className="profile-menu">
        <h3>Edit Page</h3>
        <p onClick={() => setScreen('home')}>Home Page</p>
        <p onClick={() => setScreen('about')}>About us Page</p>
        <p onClick={() => setScreen('services')}>Services Page</p>
        <p onClick={() => setScreen('contact')}>Contact us Page</p>
      </div>
      { screen === 'home' ? 
        (<AdminEditHomePage />) : 
        screen === 'about' ? (<AdminEditAboutUs />) :
        screen === 'services' ? (<AdminEditServices />) : 
        (<AdminEditContactUs />)}
    </div>
  )
};

export default AdminEditPagesScreen;
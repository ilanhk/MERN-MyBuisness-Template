
import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ProfileSecurity from "./ProfileSecurity";
import ProfileFavorites from "./ProfileFavorites";
import './css/profile.css';

const ProfileScreen = () => {
  const [screen, setScreen ] = useState('profile');
  return (
    <div className="profile-container">
      <div className="profile-menu">
        <h3>Settings</h3>
        <p onClick={() => setScreen('profile')}>profile</p>
        <p onClick={() => setScreen('security')}>security</p>
        <p onClick={() => setScreen('favorites')}>favorites</p>
      </div>
      { screen === 'profile' ? (<ProfileInfo />) : screen === 'security' ? (<ProfileSecurity />) : (<ProfileFavorites />)}
    </div>
  )
};

export default ProfileScreen;
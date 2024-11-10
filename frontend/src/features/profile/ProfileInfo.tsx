import { useEffect, useState } from 'react';
import { useGetUserProfile } from './state/hooks';
import { ProfileState } from './state/slice';
import capitalizeFirstLetter from '../../general/utils/capitalizeFirstLetter';
import './css/profile.css';


const ProfileInfo = () => {
  const [profile, setProfile] = useState<ProfileState | null >(null)
  const getProfilehook = useGetUserProfile();

  useEffect(()=>{
    const getProfile = async ()=>{
      const profileInfo = await getProfilehook();
      setProfile(profileInfo.payload);
    };

    getProfile();
  }, [getProfilehook])
  


  return (
    <div className="profile-info-container">
      <h2>Account Info:</h2>
      <div className="profile-info-inner-container">
        <div>
          <p>first name: {profile?.firstName ? capitalizeFirstLetter(profile.firstName) : ''}</p>
          <p>last name: {profile?.lastName ? capitalizeFirstLetter(profile.lastName) : ''}</p>
          <p>email: {profile?.email ? profile.email : ''}</p>
        </div>
        <div>Edit Button</div>
      </div>

    </div>
  )
}

export default ProfileInfo;
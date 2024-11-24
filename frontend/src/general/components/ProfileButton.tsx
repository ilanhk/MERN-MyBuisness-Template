import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import { UpperCaseInitials } from '../utils/initials';
import { IndDB } from '../utils/indexedDB';
import '../css/profileButton.css';
import { useSelectAuth, useLogout } from '../../features/auth/state/hooks';

const ProfileButton = () => {
  const auth = useSelectAuth();
  const userInitials = UpperCaseInitials(auth.fullName);

  const indexedDB = IndDB.instance;
  const navigate = useNavigate();
  const logoutHook = useLogout();

  const handleLogOut = async () => {
    logoutHook();
    await indexedDB.saveDataToDB('token', null);
    navigate('/');
  };

  return (
    <Fab 
      size="large" 
      color="secondary" 
      aria-label="profile" 
      className="profile-button"
      >
      {userInitials}
      <ul className="dropdown-menu">
        <li className="dropdown-item">
          <Link to='/profile'>Profile</Link>
        </li>
        <li className="dropdown-item" onClick={handleLogOut}>
          Logout
        </li>
      </ul>
    </Fab>
  );
};

export default memo(ProfileButton);
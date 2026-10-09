import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Fab, { size: "large", color: "secondary", "aria-label": "profile", className: "profile-button", children: [userInitials, _jsxs("ul", { className: "dropdown-menu", children: [_jsx("li", { className: "dropdown-item", children: _jsx(Link, { to: '/profile', children: "Profile" }) }), _jsx("li", { className: "dropdown-item", onClick: handleLogOut, children: "Logout" })] })] }));
};
export default memo(ProfileButton);

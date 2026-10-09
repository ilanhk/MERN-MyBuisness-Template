import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ProfileSecurity from "./ProfileSecurity";
import ProfileFavorites from "./ProfileFavorites";
import './css/profile.css';
const ProfileScreen = () => {
    const [screen, setScreen] = useState('profile');
    return (_jsxs("div", { className: "profile-container", children: [_jsxs("div", { className: "profile-menu", children: [_jsx("h3", { children: "Settings" }), _jsx("p", { onClick: () => setScreen('profile'), children: "Profile" }), _jsx("p", { onClick: () => setScreen('security'), children: "Security and Data Privacy" }), _jsx("p", { onClick: () => setScreen('favorites'), children: "Favorites" })] }), screen === 'profile' ? (_jsx(ProfileInfo, {})) : screen === 'security' ? (_jsx(ProfileSecurity, {})) : (_jsx(ProfileFavorites, {}))] }));
};
export default ProfileScreen;

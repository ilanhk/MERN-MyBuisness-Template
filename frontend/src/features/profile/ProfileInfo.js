import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGetUserProfile } from './state/hooks';
import capitalizeFirstLetter from '../../general/utils/capitalizeFirstLetter';
import './css/profile.css';
const ProfileInfo = () => {
    const [profile, setProfile] = useState(null);
    const getProfilehook = useGetUserProfile();
    useEffect(() => {
        const getProfile = async () => {
            const profileInfo = await getProfilehook();
            setProfile(profileInfo.payload);
        };
        getProfile();
    }, [getProfilehook]);
    return (_jsxs("div", { className: "profile-info-container", children: [_jsx("h2", { children: "Account Info:" }), _jsxs("div", { className: "profile-info-inner-container", children: [_jsxs("div", { children: [_jsxs("p", { children: ["first name: ", (profile === null || profile === void 0 ? void 0 : profile.firstName) ? capitalizeFirstLetter(profile.firstName) : ''] }), _jsxs("p", { children: ["last name: ", (profile === null || profile === void 0 ? void 0 : profile.lastName) ? capitalizeFirstLetter(profile.lastName) : ''] }), _jsxs("p", { children: ["email: ", (profile === null || profile === void 0 ? void 0 : profile.email) ? profile.email : ''] })] }), _jsx("div", { children: "Edit Button" })] })] }));
};
export default ProfileInfo;

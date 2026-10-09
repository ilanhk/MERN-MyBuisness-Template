import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useGetUserProfile, useUpdateProfile } from "./state/hooks";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { get2faQrCode } from "../../general/utils/2faApis";
const ProfileSecurity = () => {
    const [twoFA, setTwoFA] = useState(false);
    const [qr, setQr] = useState('');
    const getUserProfileHook = useGetUserProfile();
    const updateUserProfileHook = useUpdateProfile();
    let profile;
    useEffect(() => {
        const getProfileData = async () => {
            profile = await getUserProfileHook();
            if (profile.payload.twoFaSecret) {
                setTwoFA(true);
                console.log(profile.payload);
            }
            else {
                setTwoFA(false);
            }
            ;
        };
        getProfileData();
    }, []);
    const handleGetResetTwoFA = async () => {
        const data = await get2faQrCode();
        console.log('qrcode data: ', data);
        setQr(data.qrCode);
        setTwoFA(true);
    };
    const handleRemoveTwoFA = async () => {
        await updateUserProfileHook({ twoFaSecret: null });
        setQr('');
        setTwoFA(false);
    };
    return (_jsxs("div", { children: [_jsx("h3", { children: "Security and Data Privacy:" }), _jsx("p", { children: "Want to set up Two Step Authentication? " }), _jsx(Button, { variant: "contained", size: "large", onClick: handleGetResetTwoFA, children: "Get/Reset 2FA QR Code" }), twoFA &&
                _jsx(Button, { variant: "contained", color: "error", className: "remove-twofa-button", startIcon: _jsx(DeleteIcon, {}), onClick: handleRemoveTwoFA, children: "Remove 2FA" }), twoFA && (_jsxs("div", { children: [_jsx("p", { children: "Scan the QR code:" }), _jsx("img", { className: "qr-code-image", src: qr })] }))] }));
};
export default ProfileSecurity;

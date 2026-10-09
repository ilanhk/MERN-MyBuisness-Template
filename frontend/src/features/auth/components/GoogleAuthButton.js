import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleOAuth } from '../state/hooks';
const GoogleAuthButton = ({ requiresDomain = false, }) => {
    const navigate = useNavigate();
    const googleOAuthHook = useGoogleOAuth();
    const [domainName, setDomainName] = useState('');
    const [error, setError] = useState(null);
    const handleLoginSuccess = async (response) => {
        if (!response.credential) {
            setError('Google did not return a credential.');
            return;
        }
        if (requiresDomain && !domainName.trim()) {
            setError('Enter your company domain before continuing with Google.');
            return;
        }
        try {
            await googleOAuthHook(response.credential, domainName.trim() || undefined);
            navigate('/');
        }
        catch (requestError) {
            setError('Google authentication failed. Please try again.');
            console.error('Google authentication error:', requestError);
        }
    };
    const handleLoginError = () => {
        setError('Google authentication failed. Please try again.');
    };
    return (_jsxs("div", { children: [requiresDomain && (_jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "google-domain", children: "Company domain: " }), _jsx("input", { id: "google-domain", type: "text", value: domainName, onChange: (event) => {
                            setDomainName(event.target.value);
                            setError(null);
                        }, placeholder: "example.com", autoComplete: "organization" })] })), error && _jsx("p", { style: { color: 'red' }, children: error }), requiresDomain && !domainName.trim() ? (_jsx("button", { type: "button", disabled: true, children: "Enter your company domain to continue" })) : (_jsx(GoogleLogin, { onSuccess: handleLoginSuccess, onError: handleLoginError, useOneTap: true }))] }));
};
export default GoogleAuthButton;

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { IndDB } from '../../general/utils/indexedDB';
import { useLogin, useSelectAuth } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";
import GoogleAuthButton from "./components/GoogleAuthButton";
const LoginScreen = () => {
    const auth = useSelectAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null); // get reference from to an html element expecially its value
    const passwordRef = useRef(null);
    const twoFARef = useRef(null);
    const [twoFARequired, setTwoFARequired] = useState(false);
    const [error, setError] = useState(null);
    const indexedDB = IndDB.instance;
    const navigate = useNavigate();
    const loginHook = useLogin();
    useEffect(() => {
        if (auth === null || auth === void 0 ? void 0 : auth.refreshToken) {
            indexedDB.saveDataToDB("token", auth.refreshToken);
            console.log(indexedDB, auth);
        }
        ;
    }, [auth, indexedDB]);
    const submitHandler = async (e) => {
        var _a, _b, _c;
        e.preventDefault();
        const emailR = ((_a = emailRef.current) === null || _a === void 0 ? void 0 : _a.value) + '';
        const passwordR = ((_b = passwordRef.current) === null || _b === void 0 ? void 0 : _b.value) + '';
        setEmail(emailR);
        setPassword(passwordR);
        const twoFACode = (_c = twoFARef.current) === null || _c === void 0 ? void 0 : _c.value;
        if (!email || !password) {
            setError("Both fields are required.");
            return;
        }
        ;
        try {
            let response;
            if (twoFARequired) {
                if (!twoFACode) {
                    setError("2FA code required.");
                }
                ;
                response = await loginHook(email, password, twoFACode);
            }
            else {
                response = await loginHook(email, password);
            }
            ;
            if (response.meta.requestStatus === "fulfilled") {
                navigate('/'); // Navigate to the main page
            }
            else {
                setTwoFARequired(true);
                setError(null);
            }
        }
        catch (err) {
            // Catch specific error based on error message or code
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.message; // Adjust based on actual error structure
                setError(errorMessage);
            }
            else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Login error:", err);
        }
    };
    return (_jsxs("div", { className: 'form-container', children: [_jsx("h2", { className: 'form-title', children: "Login" }), _jsxs("form", { className: 'form-form', onSubmit: submitHandler, noValidate: true, children: [twoFARequired ? (_jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "twoFA", children: "2FA Code: " }), _jsx("input", { ref: twoFARef, id: "twoFA", type: "password", required: true })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "email", children: "Email: " }), _jsx("input", { ref: emailRef, id: "email", type: "email", required: true, defaultValue: 'charlie.c@example.com' })] }), _jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "password", children: "Password: " }), _jsx("input", { ref: passwordRef, id: "password", type: "password", required: true, defaultValue: 'Charliechaplain123456789!' })] })] })), error && _jsx("p", { style: { color: "red" }, children: error }), _jsx(AuthFormButton, { text: "Continue" }), _jsx("h3", { children: "OR" }), _jsx(GoogleAuthButton, {})] }), _jsxs("p", { children: ["Forgot ", _jsx(Link, { to: '/forgot-password', children: "username or password?" })] }), _jsxs("p", { children: ["New to MyBusiness? ", _jsx(Link, { to: '/register', children: "Register a new account" })] })] }));
};
export default LoginScreen;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IndDB } from '../../general/utils/indexedDB';
import AuthFormButton from './components/AuthFormButton';
import GoogleAuthButton from './components/GoogleAuthButton';
import { useSelectAuth, useRegister } from './state/hooks';
import './css/forms.css';
const RegisterScreen = () => {
    const auth = useSelectAuth();
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const inEmailListRef = useRef(null);
    const [error, setError] = useState(null);
    const indexedDB = IndDB.instance;
    const navigate = useNavigate();
    const registerHook = useRegister();
    useEffect(() => {
        if (auth === null || auth === void 0 ? void 0 : auth.refreshToken) {
            indexedDB.saveDataToDB("token", auth.refreshToken);
            console.log(indexedDB, auth);
        }
        ;
    }, [auth, indexedDB]);
    const submitHandler = async (e) => {
        var _a, _b, _c, _d, _e, _f;
        // Register user
        e.preventDefault();
        const firstName = (_a = firstNameRef.current) === null || _a === void 0 ? void 0 : _a.value;
        const lastName = (_b = lastNameRef.current) === null || _b === void 0 ? void 0 : _b.value;
        const fullName = `${firstName} ${lastName}`;
        const email = (_c = emailRef.current) === null || _c === void 0 ? void 0 : _c.value;
        const password = (_d = passwordRef.current) === null || _d === void 0 ? void 0 : _d.value;
        const confirmPassword = (_e = confirmPasswordRef.current) === null || _e === void 0 ? void 0 : _e.value;
        const inEmailList = ((_f = inEmailListRef.current) === null || _f === void 0 ? void 0 : _f.checked) || false;
        if (!firstName || !lastName || !email || !password || !confirmPassword || !inEmailList) {
            setError("All fields are required.");
            return;
        }
        ;
        if (password !== confirmPassword) {
            setError("passwords dont match");
            return;
        }
        ;
        await registerHook(firstName, lastName, fullName, email, inEmailList, password);
        // indexedDB.saveDataToDB("token", auth.refreshToken);
        navigate('/');
    };
    return (_jsxs("div", { className: 'form-container', children: [_jsx("h2", { className: 'form-title', children: "Sign In" }), _jsxs("form", { className: 'form-form', onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "firstName", children: "First Name: " }), _jsx("input", { ref: firstNameRef, id: "firstName", type: "text", required: true })] }), _jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "lastName", children: "Last Name: " }), _jsx("input", { ref: lastNameRef, id: "lastName", type: "text", required: true })] }), _jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "email", children: "Email: " }), _jsx("input", { ref: emailRef, id: "email", type: "email", required: true })] }), _jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "password", children: "Password: " }), _jsx("input", { ref: passwordRef, id: "password", type: "password", required: true })] }), _jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password: " }), _jsx("input", { ref: confirmPasswordRef, id: "confirmPassword", type: "password", required: true })] }), _jsxs("div", { className: 'form-checkbox', children: [_jsx("input", { type: "checkbox", id: "acknowlegde", ref: inEmailListRef, required: true }), _jsx("label", { htmlFor: "inEmailList", children: "Subscribe to MyBusiness newsletter" })] }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsx(AuthFormButton, { text: "Register" }), _jsx("h3", { children: "OR" }), _jsx(GoogleAuthButton, { requiresDomain: true })] }), _jsxs("p", { children: ["Have an account? ", _jsx(Link, { to: "/login", children: "Login" })] })] }));
};
export default RegisterScreen;

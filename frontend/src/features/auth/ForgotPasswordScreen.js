import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { useForgotPassword } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";
const ForgotPasswordScreen = () => {
    const emailRef = useRef(null);
    const [error, setError] = useState(null);
    const forgotPasswordHook = useForgotPassword();
    const submitHandler = async (e) => {
        var _a;
        e.preventDefault();
        const email = ((_a = emailRef.current) === null || _a === void 0 ? void 0 : _a.value) + '';
        if (!email) {
            setError("Email is required.");
        }
        ;
        try {
            const response = await forgotPasswordHook(email);
            console.log(email);
            if (response.meta.requestStatus === "fulfilled") {
                console.log('reset email sent!');
            }
            else {
                console.log(response);
            }
        }
        catch (error) {
            console.log(error);
        }
        ;
    };
    return (_jsxs("div", { className: 'form-container', children: [_jsx("h2", { className: 'form-title', children: "Forgot Password" }), _jsxs("form", { className: 'form-form', onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "email", children: "Email: " }), _jsx("input", { ref: emailRef, id: "email", type: "email", required: true, defaultValue: 'ilanlieberman@hotmail.com' })] }), error && _jsx("p", { style: { color: "red" }, children: error }), _jsx(AuthFormButton, { text: "Continue" })] }), _jsxs("p", { children: ["Forgot ", _jsx(Link, { to: '/forgot-password', children: "username or password?" })] }), _jsxs("p", { children: ["New to MyBusiness? ", _jsx(Link, { to: '/register', children: "Register a new account" })] })] }));
};
export default ForgotPasswordScreen;

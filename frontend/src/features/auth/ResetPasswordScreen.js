import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { useResetPassword } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";
const ResetPasswordScreen = () => {
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [error, setError] = useState(null);
    const resetPasswordHook = useResetPassword();
    const submitHandler = async (e) => {
        var _a, _b;
        e.preventDefault();
        const password = (_a = passwordRef.current) === null || _a === void 0 ? void 0 : _a.value;
        const confirmPassword = (_b = confirmPasswordRef.current) === null || _b === void 0 ? void 0 : _b.value;
        if (!password || !confirmPassword) {
            setError("New Password and confirmed password is required.");
        }
        ;
        if (password !== confirmPassword) {
            setError("passwords dont match");
            return;
        }
        ;
        try {
            const response = await resetPasswordHook(password);
            // if (response.meta.requestStatus === "fulfilled") {
            //   navigate('/'); // Navigate to the main page
            // } else {
            //   setTwoFARequired(true);
            //   setError(null);
            // }
        }
        catch (error) {
            console.log(error);
        }
        ;
    };
    return (_jsxs("div", { className: 'form-container', children: [_jsx("h2", { className: 'form-title', children: "Forgot Password" }), _jsxs("form", { className: 'form-form', onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "password", children: "Password: " }), _jsx("input", { ref: passwordRef, id: "password", type: "password", required: true })] }), _jsxs("div", { className: 'form-input', children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password: " }), _jsx("input", { ref: confirmPasswordRef, id: "confirmPassword", type: "password", required: true })] }), error && _jsx("p", { style: { color: "red" }, children: error }), _jsx(AuthFormButton, { text: "Continue" })] }), _jsxs("p", { children: ["Forgot ", _jsx(Link, { to: '/forgot-password', children: "username or password?" })] }), _jsxs("p", { children: ["New to MyBusiness? ", _jsx(Link, { to: '/register', children: "Register a new account" })] })] }));
};
export default ResetPasswordScreen;

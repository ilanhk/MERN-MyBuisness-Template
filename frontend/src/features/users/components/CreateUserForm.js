import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AuthFormButton from '../../auth/components/AuthFormButton';
import { useCreateUser } from '../state/hooks';
const CreateUserForm = () => {
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userIsEmployee, setUserIsEmployee] = useState(false);
    const [userInEmailList, setUserInEmailList] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const createUserHook = useCreateUser();
    const handleInEmailList = (e) => {
        setUserInEmailList(e.target.checked);
    };
    const submitHandler = async (e) => {
        var _a, _b;
        e.preventDefault();
        if (!userFirstName || !userLastName || !userEmail || !userPassword) {
            setError('First name, last name, email, and password are required.');
            return;
        }
        const fullName = `${userFirstName} ${userLastName}`.trim();
        try {
            const newUser = await createUserHook(userFirstName, userLastName, fullName, userEmail, userInEmailList, userPassword, userIsEmployee);
            console.log('User added:', newUser);
            navigate('/admin/userlist');
        }
        catch (err) {
            const errorMessage = ((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || // Axios-style error
                (err === null || err === void 0 ? void 0 : err.message) || // JS Error
                'Failed to create user. Please try again.';
            setError(errorMessage);
        }
    };
    return (_jsxs("div", { className: "form-container", children: [_jsx("h2", { className: "form-title", children: "Create a New User" }), _jsxs("form", { className: "form-form", onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userFirstName", children: "First Name:" }), _jsx("input", { id: "userFirstName", type: "text", value: userFirstName, onChange: (e) => setUserFirstName(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userLastName", children: "Last Name:" }), _jsx("input", { id: "userLastName", type: "text", value: userLastName, onChange: (e) => setUserLastName(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userEmail", children: "Email:" }), _jsx("input", { id: "userEmail", type: "email", value: userEmail, onChange: (e) => setUserEmail(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userPassword", children: "Password:" }), _jsx("input", { id: "userPassword", type: "password", value: userPassword, onChange: (e) => setUserPassword(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userType", children: "Type of User:" }), _jsxs(RadioGroup, { row: true, name: "userType", value: userIsEmployee ? 'employee' : 'customer', onChange: (e) => setUserIsEmployee(e.target.value === 'employee'), children: [_jsx(FormControlLabel, { value: "customer", control: _jsx(Radio, {}), label: "Customer" }), _jsx(FormControlLabel, { value: "employee", control: _jsx(Radio, {}), label: "Employee" })] })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userInEmailList", children: "In Email List:" }), _jsx(Switch, { id: "userInEmailList", checked: userInEmailList, onChange: handleInEmailList })] }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsx(AuthFormButton, { text: "Create" })] })] }));
};
export default CreateUserForm;

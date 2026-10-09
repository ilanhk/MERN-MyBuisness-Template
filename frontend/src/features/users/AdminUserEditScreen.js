import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormMessage from '../../general/components/FormMessage';
import AuthFormButton from '../auth/components/AuthFormButton';
import BackButton from '../../general/components/BackButton';
import Loader from '../../general/components/Loader';
import { useGetUsersById, useUpdateUser, useSelectUsers } from './state/hooks';
const AdminUserEditScreen = () => {
    const { id } = useParams();
    const getUserByIdHook = useGetUsersById();
    const users = useSelectUsers();
    const updateUserHook = useUpdateUser();
    const user = users.find((u) => String(u._id) === String(id));
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userIsEmployee, setUserIsEmployee] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userInEmailList, setUserInEmailList] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
        if (id) {
            getUserByIdHook(id);
        }
    }, [id, getUserByIdHook]);
    useEffect(() => {
        if (user) {
            setUserFirstName(user.firstName || '');
            setUserLastName(user.lastName || '');
            setUserEmail(user.email || '');
            setUserIsEmployee(user.isEmployee || false);
            setUserIsAdmin(user.isAdmin || false);
            setUserInEmailList(user.inEmailList || false);
        }
    }, [user]);
    const handleIsAdminChange = (e) => {
        setUserIsAdmin(e.target.checked);
    };
    const handleInEmailListChange = (e) => {
        setUserInEmailList(e.target.checked);
    };
    const submitHandler = async (e) => {
        var _a, _b;
        e.preventDefault();
        setIsSuccess(false);
        setIsLoading(true);
        const updatedData = {
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            isEmployee: userIsEmployee,
            isAdmin: userIsAdmin,
            inEmailList: userInEmailList,
        };
        try {
            const updatedUser = await updateUserHook(id, updatedData);
            console.log('User updated:', updatedUser);
            setIsSuccess(true);
        }
        catch (err) {
            const errorMessage = ((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) ||
                (err === null || err === void 0 ? void 0 : err.message) ||
                'Failed to update user. Please try again.';
            setError(errorMessage);
        }
        setIsLoading(false);
    };
    if (!user)
        return _jsx("p", { children: "Loading user data..." });
    return (_jsxs("div", { className: "form-container", children: [_jsx(BackButton, { route: '/admin/userlist' }), _jsx("h2", { className: "form-title", children: "Update User" }), _jsxs("form", { className: "form-form", onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userFirstName", children: "First Name:" }), _jsx("input", { id: "userFirstName", type: "text", value: userFirstName, onChange: (e) => setUserFirstName(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userLastName", children: "Last Name:" }), _jsx("input", { id: "userLastName", type: "text", value: userLastName, onChange: (e) => setUserLastName(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userEmail", children: "Email:" }), _jsx("input", { id: "userEmail", type: "email", value: userEmail, onChange: (e) => setUserEmail(e.target.value), required: true })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userType", children: "Type of User:" }), _jsxs(RadioGroup, { row: true, name: "userType", value: userIsEmployee ? 'employee' : 'customer', onChange: (e) => setUserIsEmployee(e.target.value === 'employee'), children: [_jsx(FormControlLabel, { value: "customer", control: _jsx(Radio, {}), label: "Customer" }), _jsx(FormControlLabel, { value: "employee", control: _jsx(Radio, {}), label: "Employee" })] })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userIsAdmin", children: "Is Admin:" }), _jsx(Switch, { id: "userIsAdmin", checked: userIsAdmin, onChange: handleIsAdminChange })] }), _jsxs("div", { className: "form-input", children: [_jsx("label", { htmlFor: "userInEmailList", children: "In Email List:" }), _jsx(Switch, { id: "userInEmailList", checked: userInEmailList, onChange: handleInEmailListChange })] }), _jsx(AuthFormButton, { type: "submit", text: "Update" }), error && (_jsx("div", { className: "form-message-wrapper", children: _jsx(FormMessage, { message: error, level: "error" }) })), isSuccess && (_jsx("div", { className: "form-message-wrapper", children: _jsx(FormMessage, { message: "User Updated!", level: "success" }) })), isLoading && (_jsx("div", { className: "form-message-wrapper", children: _jsx(Loader, { size: "small" }) }))] })] }));
};
export default AdminUserEditScreen;

import { jsx as _jsx } from "react/jsx-runtime";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
const LoginButton = () => {
    return (_jsx(Button, { component: Link, to: "/login", variant: "contained", size: "small", children: "Login" }));
};
export default LoginButton;

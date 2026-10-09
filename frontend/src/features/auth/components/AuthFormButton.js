import { jsx as _jsx } from "react/jsx-runtime";
import Button from '@mui/material/Button';
const AuthFormButton = ({ text }) => {
    return (_jsx(Button, { variant: "contained", size: "large", className: "auth-form-button", type: "submit", children: text }));
};
export default AuthFormButton;

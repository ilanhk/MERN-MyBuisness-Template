import { jsx as _jsx } from "react/jsx-runtime";
import Alert from '@mui/material/Alert';
import '../css/FormMessage.css';
const FormMessage = ({ message, level }) => {
    return (_jsx(Alert, { severity: level, className: "form-alert", children: message }));
};
export default FormMessage;

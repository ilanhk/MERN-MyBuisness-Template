import { jsx as _jsx } from "react/jsx-runtime";
import Button from '@mui/material/Button';
import { memo } from 'react';
import '../css/companyInfoForms.css';
const CIFormButton = ({ text, color, onClick }) => {
    return (_jsx(Button, { variant: "contained", color: color, size: "medium", className: "ci-form-button", type: "submit", onClick: onClick, children: text }));
};
export default memo(CIFormButton);

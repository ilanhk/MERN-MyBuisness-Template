import { jsx as _jsx } from "react/jsx-runtime";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import '../css/ovalButton.css';
;
const OvalButton = ({ path, text }) => {
    return (_jsx(Link, { to: path, children: _jsx(Button, { variant: "contained", size: "large", className: 'oval-button', children: text }) }));
};
export default OvalButton;

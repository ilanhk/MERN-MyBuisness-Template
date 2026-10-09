import { jsx as _jsx } from "react/jsx-runtime";
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // <-- Import the icon
import { memo } from 'react';
import { Link } from 'react-router-dom';
const BackButton = ({ route }) => {
    return (_jsx(Link, { to: route, style: { textDecoration: 'none' }, children: _jsx(Button, { variant: "contained", color: "info", size: "small", className: "back-button", startIcon: _jsx(ArrowBackIcon, {}), children: "Back" }) }));
};
export default memo(BackButton);

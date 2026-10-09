import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import '../css/websiteStylesForms.css';
const SaveButton = ({ onClick }) => {
    return (_jsx("button", { type: "button", className: "ws-save-button", onClick: onClick, children: _jsx(SaveAltOutlinedIcon, {}) }));
};
export default memo(SaveButton);

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
const FileUpload = ({ onFileChange }) => {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileChange(e.target.files[0]);
        }
    };
    return (_jsx("div", { children: _jsx("input", { name: "file", type: "file", onChange: handleFileChange }) }));
};
export default memo(FileUpload);

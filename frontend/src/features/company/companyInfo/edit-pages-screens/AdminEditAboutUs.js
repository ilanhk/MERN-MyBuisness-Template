import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useUpdateCompanyInfo, useSelectCompanyInfo, useSelectCompanyInfoStatus } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import CIFormButton from '../components/CIFormButton';
import UploadFile from '../../../../general/components/UploadFile';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import '../css/companyInfoForms.css';
const AdminEditAboutUs = () => {
    const companyInfo = useSelectCompanyInfo();
    const status = useSelectCompanyInfoStatus();
    const updateCompanyInfoHook = useUpdateCompanyInfo();
    const aboutInfo = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.about;
    const { title, description, image } = aboutInfo;
    // Use state variables to manage form inputs
    const [aboutTitle, setAboutTitle] = useState(title || '');
    const [aboutDescription, setAboutDescription] = useState(description || '');
    const [file, setFile] = useState(null);
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const submitHandler = async (e) => {
        e.preventDefault();
        let updatedImageURL = image;
        if (file) {
            try {
                const data = await uploadSingleFile(file);
                console.log('data from upload', data);
                updatedImageURL = data; // Use the temporary variable
            }
            catch (err) {
                console.error('Error uploading file:', err);
                setIsError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                return; // Exit on error
            }
        }
        const dataToUpdate = {
            about: {
                title: aboutTitle || null,
                description: aboutDescription || null,
                image: updatedImageURL || null,
            },
        };
        try {
            setIsSuccess(false);
            const update = await updateCompanyInfoHook(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id, dataToUpdate);
            console.log('update about', update);
            if (status === EnumStatus.Fail) {
                throw new Error('This is not working');
            }
            if (status === EnumStatus.Success) {
                setIsSuccess(true);
                console.log('Company info updated!');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error updating company info:', error.message);
                setIsError(error.message);
            }
            else {
                console.error('Unexpected error:', error);
                setIsError('An unexpected error occurred.');
            }
        }
    };
    return (_jsxs("div", { className: "ci-form-container", children: [_jsx("h2", { className: "ci-formScreen-title", children: "Edit About Us page" }), !aboutInfo ? (_jsx("div", { children: "Please go to Company Information on the left menu and add company info" })) : (_jsx("form", { className: "ci-form", onSubmit: submitHandler, noValidate: true, children: _jsxs("div", { className: 'ci-form-with-button-and-message-section', children: [_jsxs("div", { className: 'ci-form-input-section', children: [_jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "aboutTitle", className: 'ci-label', children: "Title: " }), _jsx(TextField, { id: "aboutTitle", value: aboutTitle || '', onChange: (e) => setAboutTitle(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "aboutDescription", className: 'ci-label', children: "Description: " }), _jsx(TextField, { id: "aboutDescription", value: aboutDescription || '', onChange: (e) => setAboutDescription(e.target.value), multiline: true, maxRows: 100 })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "aboutImage", className: "ci-label", children: "About Us Image:" }), _jsx(UploadFile, { onFileChange: setFile })] })] }), _jsxs("div", { className: 'ci-button-and-message-section', children: [_jsx(CIFormButton, { text: 'Edit', color: 'primary' }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "About Us Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }) }))] }));
};
export default AdminEditAboutUs;

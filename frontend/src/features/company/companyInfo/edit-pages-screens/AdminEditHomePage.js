import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useSelectCompanyInfo, useSelectCompanyInfoStatus, useUpdateCompanyInfo, } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import CIFormButton from '../components/CIFormButton';
import UploadFile from '../../../../general/components/UploadFile';
import FormMessage from '../../../../general/components/FormMessage';
import Loader from '../../../../general/components/Loader';
import '../css/companyInfoForms.css';
const AdminEditHomePage = () => {
    const companyInfo = useSelectCompanyInfo();
    const status = useSelectCompanyInfoStatus();
    const updateCompanyInfoHook = useUpdateCompanyInfo();
    // Safely access companyInfo.home
    const homeInfo = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.home;
    const valueProposition = homeInfo === null || homeInfo === void 0 ? void 0 : homeInfo.valueProposition;
    // Check if valueProposition is undefined or null before using its properties
    const [proposition, setProposition] = useState((valueProposition === null || valueProposition === void 0 ? void 0 : valueProposition.proposition) || '');
    const [callToAction, setCallToAction] = useState((valueProposition === null || valueProposition === void 0 ? void 0 : valueProposition.callToAction) || '');
    const [file, setFile] = useState(null);
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const submitHandler = async (e) => {
        e.preventDefault();
        let updatedImageURL = valueProposition.image;
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
            home: {
                valueProposition: {
                    proposition: proposition || null, // Ensure null for empty fields
                    callToAction: callToAction || null,
                    image: updatedImageURL || null,
                },
                customerSection: homeInfo.customerSection, // Preserve existing data or default to empty
            },
        };
        try {
            setIsSuccess(false);
            const update = await updateCompanyInfoHook(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id, dataToUpdate);
            console.log('update homepage', update);
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
    return (_jsxs("div", { className: "ci-form-container", children: [_jsx("h2", { className: "ci-formScreen-title", children: "Edit Homepage" }), !(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.home) ? (_jsx("div", { children: "Please go to Company Information on the left menu and add company info" })) : (_jsxs("form", { className: "ci-form", onSubmit: submitHandler, noValidate: true, children: [_jsx("h4", { className: "ci-form-title", children: "Edit Value Proposition and Call to Action" }), _jsxs("div", { className: "ci-form-with-button-and-message-section", children: [_jsxs("div", { className: "ci-form-input-section", children: [_jsxs("div", { className: "ci-form-input", children: [_jsxs("label", { htmlFor: "proposition", className: "ci-label", children: ["Proposition:", ' '] }), _jsx(TextField, { id: "proposition", value: proposition || '', onChange: (e) => setProposition(e.target.value), multiline: true, maxRows: 4 })] }), _jsxs("div", { className: "ci-form-input", children: [_jsxs("label", { htmlFor: "callToAction", className: "ci-label", children: ["Call to Action:", ' '] }), _jsx(TextField, { id: "callToAction", value: callToAction || '', onChange: (e) => setCallToAction(e.target.value), multiline: true, maxRows: 4 })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "aboutImage", className: "ci-label", children: "Proposition Image:" }), _jsx(UploadFile, { onFileChange: setFile })] })] }), _jsxs("div", { className: "ci-button-and-message-section", children: [_jsx(CIFormButton, { text: "Edit", color: "primary" }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "Proposition Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] })] }))] }));
};
export default AdminEditHomePage;

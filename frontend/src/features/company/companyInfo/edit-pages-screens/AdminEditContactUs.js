import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useSelectCompanyInfo, useSelectCompanyInfoStatus, useUpdateCompanyInfo } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../components/CIFormButton';
import CompanyContactInfoForm from '../components/CompanyContactInfoForm';
import CompanySocialMediaForm from '../components/CompanySocialMediaForm';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import '../css/companyInfoForms.css';
const AdminEditContactUs = () => {
    const companyInfo = useSelectCompanyInfo();
    const status = useSelectCompanyInfoStatus();
    const updateCompanyInfoHook = useUpdateCompanyInfo();
    const contactInfo = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.contactUs;
    const { title, description, email, phone, address, socialMedia } = contactInfo;
    const [contactTitle, setContactTitle] = useState(title || '');
    const [contactDescription, setContactDescription] = useState(description || '');
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const submitHandler = async (e) => {
        e.preventDefault();
        // Use state directly for form data
        const dataToUpdate = {
            contactUs: {
                title: contactTitle || null,
                description: contactDescription || null,
                email,
                phone,
                address,
                socialMedia,
            },
        };
        try {
            setIsSuccess(false);
            const update = await updateCompanyInfoHook(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id, dataToUpdate);
            console.log('update contactus', update);
            if (status === EnumStatus.Fail) {
                throw new Error('This is not working');
            }
            ;
            if (status === EnumStatus.Success) {
                setIsSuccess(true);
                console.log('Company info updated!');
            }
            ;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error updating company info:", error.message);
                setIsError(error.message);
            }
            else {
                console.error("Unexpected error:", error);
                setIsError("An unexpected error occurred.");
            }
        }
        ;
    };
    return (_jsxs("div", { className: "ci-form-container", children: [_jsx("h2", { className: "ci-formScreen-title", children: "Edit Contact Us page" }), !contactInfo ? (_jsx("div", { children: "Please go to Company Information on the left menu and add company info" })) : (_jsx("form", { className: "ci-form", onSubmit: submitHandler, noValidate: true, children: _jsxs("div", { className: 'ci-form-with-button-and-message-section', children: [_jsxs("div", { className: 'ci-form-input-section', children: [_jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "contactTitle", className: 'ci-label', children: "Title: " }), _jsx(TextField, { id: "contactTitle", value: contactTitle || '', onChange: (e) => setContactTitle(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "contactDescription", className: 'ci-label', children: "Description: " }), _jsx(TextField, { id: "contactDescription", value: contactDescription || '', onChange: (e) => setContactDescription(e.target.value), multiline: true, maxRows: 2 })] })] }), _jsxs("div", { className: 'ci-button-and-message-section', children: [_jsx(CIFormButton, { text: 'Edit', color: 'primary' }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "About Us Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }) })), _jsx(CompanyContactInfoForm, {}), _jsx(CompanySocialMediaForm, {})] }));
};
export default AdminEditContactUs;

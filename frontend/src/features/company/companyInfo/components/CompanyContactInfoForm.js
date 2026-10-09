import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useUpdateCompanyInfo, useSelectCompanyInfo, useSelectCompanyInfoStatus } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import CountrySelect from '../../../../general/components/CountrySelect';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../css/companyInfoForms.css';
const CompanyContactInfoForm = () => {
    const companyInfo = useSelectCompanyInfo();
    const status = useSelectCompanyInfoStatus();
    const updateCompanyInfoHook = useUpdateCompanyInfo();
    const contactInfo = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.contactUs;
    const { title, description, email, phone, address, socialMedia } = contactInfo;
    const [contactUsEmail, setContactUsEmail] = useState(email.contact || '');
    const [websiteEmail, setWebsiteEmail] = useState(email.website || '');
    const [countryCodeNumber, setCountryCodeNumber] = useState((phone === null || phone === void 0 ? void 0 : phone.countryCode) || '+1');
    const [phoneNumber, setPhoneNumber] = useState(phone.phone || '');
    const [faxNumber, setFaxNumber] = useState(phone.fax || '');
    const [addressOne, setAddressOne] = useState(address.address1 || '');
    const [addressTwo, setAddressTwo] = useState(address.address2 || '');
    const [addressArea, setAddressArea] = useState(address.area || '');
    const [addressCity, setAddressCity] = useState(address.city || '');
    const [addressCountry, setAddressCountry] = useState(address.country || '');
    const [addressZipCode, setAddressZipCode] = useState(address.postalCode || '');
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    console.log('country: ', addressCountry);
    const submitHandler = async (e) => {
        e.preventDefault();
        // Use state directly for form data
        const dataToUpdate = {
            contactUs: {
                title,
                description,
                email: {
                    contact: contactUsEmail || null,
                    website: websiteEmail || null,
                },
                phone: {
                    countryCode: countryCodeNumber || null,
                    phone: phoneNumber || null,
                    fax: faxNumber || null,
                },
                address: {
                    address1: addressOne || null,
                    address2: addressTwo || null,
                    area: addressArea || null,
                    city: addressCity || null,
                    country: addressCountry || null,
                    postalCode: addressZipCode || null,
                    fullAddress: addressOne || addressTwo || addressArea || addressCity || addressCountry || addressZipCode ?
                        `${addressOne}, ${addressTwo}, ${addressArea}, ${addressCity}, ${addressCountry}, ${addressZipCode}` :
                        null,
                },
                socialMedia,
            },
        };
        try {
            setIsSuccess(false);
            const update = await updateCompanyInfoHook(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id, dataToUpdate);
            console.log('update contact us', update);
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
    return (_jsxs("div", { className: "ci-form-container", children: [_jsx("h3", { className: "ci-form-title", children: "Edit Company Contact Information" }), !contactInfo ? (_jsx("div", { children: "Please go to Company Information on the left menu and add company info" })) : (_jsx("form", { className: "ci-form", onSubmit: submitHandler, noValidate: true, children: _jsxs("div", { className: 'ci-form-with-button-and-message-section', children: [_jsxs("div", { className: 'ci-form-input-section', children: [_jsx("h4", { children: "Company Emails:" }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "contactUsEmail", className: 'ci-label', children: "Contact Us Email: " }), _jsx(TextField, { id: "contactUsEmail", value: contactUsEmail || '', onChange: (e) => setContactUsEmail(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "websiteEmail", className: 'ci-label', children: "Website Email: " }), _jsx(TextField, { id: "websiteEmail", value: websiteEmail || '', onChange: (e) => setWebsiteEmail(e.target.value) })] }), _jsx("h4", { children: "Company Phone Number:" }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "countryCodeNumber", className: 'ci-label', children: "Country Code: " }), _jsx(ReactPhoneInput, { country: 'us', value: countryCodeNumber, onChange: (code, data) => {
                                                const fullCountryCode = (data === null || data === void 0 ? void 0 : data.dialCode) ? `+${data.dialCode}` : `+${code}`;
                                                setCountryCodeNumber(fullCountryCode); // Always prepend with "+"
                                            }, inputProps: {
                                                name: 'countryCodeNumber',
                                                autoFocus: true,
                                            }, enableLongNumbers: true, disableCountryCode: false, countryCodeEditable: true })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "phoneNumber", className: 'ci-label', children: "Phone: " }), _jsx(TextField, { id: "phoneNumber", value: phoneNumber || '', onChange: (e) => setPhoneNumber(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "faxNumber", className: 'ci-label', children: "Fax: " }), _jsx(TextField, { id: "faxNumber", value: faxNumber || '', onChange: (e) => setFaxNumber(e.target.value) })] }), _jsx("h4", { children: "Company Address:" }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "addressOne", className: 'ci-label', children: "Address 1: " }), _jsx(TextField, { id: "addressOne", value: addressOne || '', onChange: (e) => setAddressOne(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "addressTwo", className: 'ci-label', children: "Address 2: " }), _jsx(TextField, { id: "addressTwo", value: addressTwo || '', onChange: (e) => setAddressTwo(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "addressArea", className: 'ci-label', children: "Area: " }), _jsx(TextField, { id: "addressArea", value: addressArea || '', onChange: (e) => setAddressArea(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "addressCity", className: 'ci-label', children: "City: " }), _jsx(TextField, { id: "addressCity", value: addressCity || '', onChange: (e) => setAddressCity(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "addressCountry", className: 'ci-label', children: "Country: " }), _jsx(CountrySelect, { savedCountry: addressCountry, onCountryChange: setAddressCountry })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "addressZipCode", className: 'ci-label', children: "Postal Code: " }), _jsx(TextField, { id: "addressZipCode", value: addressZipCode || '', onChange: (e) => setAddressZipCode(e.target.value) })] })] }), _jsxs("div", { className: 'ci-button-and-message-section', children: [_jsx(CIFormButton, { text: 'Edit', color: 'primary' }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "About Us Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }) }))] }));
};
export default CompanyContactInfoForm;

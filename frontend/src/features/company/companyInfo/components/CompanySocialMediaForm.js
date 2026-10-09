import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useSelectCompanyInfo, useSelectCompanyInfoStatus, useUpdateCompanyInfo, } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
const CompanySocialMediaForm = () => {
    var _a;
    const companyInfo = useSelectCompanyInfo();
    const status = useSelectCompanyInfoStatus();
    const updateCompanyInfoHook = useUpdateCompanyInfo();
    const socials = ((_a = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.contactUs) === null || _a === void 0 ? void 0 : _a.socialMedia) || {
        linkedin: '',
        facebook: '',
        instagram: '',
        twitter: '',
        tiktok: '',
        youtube: '',
        amazon: '',
        aliexpress: '',
    };
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [linkedinLink, setLinkedinLink] = useState(socials.linkedin || '');
    const [facebookLink, setFacebookLink] = useState(socials.facebook || '');
    const [instagramLink, setInstagramLink] = useState(socials.instagram || '');
    const [twitterLink, setTwitterLink] = useState(socials.twitter || '');
    const [tiktokLink, setTiktokLink] = useState(socials.tiktok || '');
    const [youtubeLink, setYoutubeLink] = useState(socials.youtube || '');
    const [amazonLink, setAmazonLink] = useState(socials.amazon || '');
    const [aliexpressLink, setAliexpressLink] = useState(socials.aliexpress || '');
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.contactUs)) {
            setIsError("Company contact information is missing. Please add it first.");
            return;
        }
        const { title, description, email, phone, address, } = companyInfo.contactUs;
        const dataToUpdate = {
            contactUs: {
                title,
                description,
                email,
                phone,
                address,
                socialMedia: {
                    linkedin: linkedinLink || null,
                    facebook: facebookLink || null,
                    instagram: instagramLink || null,
                    twitter: twitterLink || null,
                    tiktok: tiktokLink || null,
                    youtube: youtubeLink || null,
                    amazon: amazonLink || null,
                    aliexpress: aliexpressLink || null,
                },
            },
        };
        try {
            setIsSuccess(false);
            const update = await updateCompanyInfoHook(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id, dataToUpdate);
            console.log('update social media', update);
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
    return (_jsxs("div", { className: "ci-form-container", children: [_jsx("h3", { className: "ci-form-title", children: "Update Company Social Media Links:" }), !(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.contactUs) ? (_jsx("div", { children: "Please go to Company Information on the left menu and add company info" })) : (_jsx("form", { className: "ci-form", onSubmit: submitHandler, noValidate: true, children: _jsxs("div", { className: "ci-form-with-button-and-message-section", children: [_jsxs("div", { className: "ci-form-input-section", children: [_jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "linkedinLink", className: "ci-label", children: "Linkedin Link:" }), _jsx(TextField, { id: "linkedinLink", value: linkedinLink || '', onChange: (e) => setLinkedinLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "facebookLink", className: "ci-label", children: "Facebook Link:" }), _jsx(TextField, { id: "facebookLink", value: facebookLink || '', onChange: (e) => setFacebookLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "instagramLink", className: "ci-label", children: "Instagram Link:" }), _jsx(TextField, { id: "instagramLink", value: instagramLink || '', onChange: (e) => setInstagramLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "twitterLink", className: "ci-label", children: "Twitter Link:" }), _jsx(TextField, { id: "twitterLink", value: twitterLink || '', onChange: (e) => setTwitterLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "tiktokLink", className: "ci-label", children: "TickTok Link:" }), _jsx(TextField, { id: "tiktokLink", value: tiktokLink || '', onChange: (e) => setTiktokLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "youtubeLink", className: "ci-label", children: "Youtube Link:" }), _jsx(TextField, { id: "youtubeLink", value: youtubeLink || '', onChange: (e) => setYoutubeLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "amazonLink", className: "ci-label", children: "Amazon Link:" }), _jsx(TextField, { id: "amazonLink", value: amazonLink || '', onChange: (e) => setAmazonLink(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "aliexpressLink", className: "ci-label", children: "Aliexpress Link:" }), _jsx(TextField, { id: "aliexpressLink", value: aliexpressLink || '', onChange: (e) => setAliexpressLink(e.target.value) })] })] }), _jsxs("div", { className: 'ci-button-and-message-section', children: [_jsx(CIFormButton, { text: 'Edit', color: 'primary' }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "Social Media Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }) }))] }));
};
export default CompanySocialMediaForm;

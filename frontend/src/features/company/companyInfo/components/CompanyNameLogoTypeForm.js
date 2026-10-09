import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { useSelectCompanyInfo, useSelectCompanyInfoStatus, useUpdateCompanyInfo, } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import UploadFile from '../../../../general/components/UploadFile';
import CIFormButton from './CIFormButton';
import FormMessage from '../../../../general/components/FormMessage';
import Loader from '../../../../general/components/Loader';
const CompanyNameLogoTypeForm = () => {
    const companyInfo = useSelectCompanyInfo();
    const updateCompanyInfoHook = useUpdateCompanyInfo();
    const status = useSelectCompanyInfoStatus();
    const info = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.company;
    const { name, logoImage, companyType } = info;
    const { isEcommerce, hasProducts } = companyType;
    const [companyName, setCompanyName] = useState(name || '');
    const [file, setFile] = useState(null);
    const [ecommerce, setEcommerce] = useState(isEcommerce);
    const [products, setProducts] = useState(hasProducts);
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const handleEcommerceChange = (event) => {
        const newEcommerceValue = event.target.checked;
        setEcommerce(newEcommerceValue);
        if (newEcommerceValue) {
            setProducts(newEcommerceValue);
        }
    };
    const handleProductsChange = (event) => {
        setProducts(event.target.checked);
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        let updatedImageURL = logoImage;
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
        console.log('ecommerce b4 submited: ', ecommerce);
        console.log('products b4 submited: ', products);
        const dataToUpdate = {
            company: {
                name: companyName || null,
                logoImage: updatedImageURL || null,
                companyType: {
                    isEcommerce: ecommerce,
                    hasProducts: products,
                },
            },
        };
        try {
            setIsSuccess(false);
            console.log('datatoupdate', dataToUpdate);
            const update = await updateCompanyInfoHook(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id, dataToUpdate);
            console.log('update company logo, name, type', update);
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
    return (_jsxs("div", { className: "ci-form-container", children: [_jsx("h3", { className: "ci-form-title", children: "Update Company Name, Logo and Type:" }), !(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.home) ? (_jsx("div", { children: "Please go to Company Information on the left menu and add company info" })) : (_jsx("form", { className: "ci-form", onSubmit: submitHandler, noValidate: true, children: _jsxs("div", { className: "ci-form-with-button-and-message-section", children: [_jsxs("div", { className: "ci-form-input-section", children: [_jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "companyName", className: "ci-label", children: "Company Name:" }), _jsx(TextField, { id: "companyName", value: companyName || '', onChange: (e) => setCompanyName(e.target.value) })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "companyLogo", className: "ci-label", children: "Company Logo:" }), _jsx(UploadFile, { onFileChange: setFile })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "ecommerce", className: "ci-label", children: "Is the business an Ecommerce:" }), _jsx("p", { children: "if no its a Service business" }), _jsx(Switch, { checked: ecommerce, onChange: handleEcommerceChange })] }), _jsxs("div", { className: "ci-form-input", children: [_jsx("label", { htmlFor: "product", className: "ci-label", children: "Does the business has products?:" }), _jsx("p", { children: "if the business has products but is not an Ecommerce business Than its a business that sells products B2B" }), _jsx(Switch, { checked: products, onChange: handleProductsChange })] })] }), _jsxs("div", { className: "ci-button-and-message-section", children: [_jsx(CIFormButton, { text: "Edit", color: "primary" }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "Name, Logo and Company Type Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }) }))] }));
};
export default CompanyNameLogoTypeForm;

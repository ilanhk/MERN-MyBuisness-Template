import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSelectWebsiteStyles, useCreateWebsiteStyles, useDeleteWebsiteStyles, } from './state/hooks';
import getReduxStatus from '../../general/utils/getReduxStatus';
import CIFormButton from '../company/companyInfo/components/CIFormButton';
import Loader from '../../general/components/Loader';
import FormMessage from '../../general/components/FormMessage';
import EditGeneralStylesForm from './components/EditGeneralStylesForm';
import EditHeaderFooterStylesForm from './components/EditHeaderFooterStylesForm';
import EditAdminStylesForm from './components/EditAdminStylesForm';
import './css/websiteStylesForms.css';
const AdminEditWebsiteStyles = () => {
    const createWebsiteStylesHook = useCreateWebsiteStyles();
    const deleteWebsiteStylesHook = useDeleteWebsiteStyles();
    const websiteStyles = useSelectWebsiteStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState('');
    const [isSuccess, setisSuccess] = useState(false);
    const handleCreateOrResetCI = async () => {
        try {
            setisSuccess(false);
            setIsLoading(true);
            // Check if the company info exists
            if (websiteStyles) {
                console.log('Deleting existing website styles...');
                await deleteWebsiteStylesHook(websiteStyles._id);
            }
            console.log('Creating new website styles...');
            const create = await createWebsiteStylesHook();
            const createReduxStatus = getReduxStatus(create.type);
            if (createReduxStatus === 'fulfilled') {
                setisSuccess(true);
            }
            else {
                setisSuccess(false);
            }
            console.log('Website styles successfully reseted.');
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error resetting website styles:', error.message);
                setIsError(error.message);
            }
            else {
                console.error('Unexpected error:', error);
                setIsError('An unexpected error occurred.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "ws-form-screen-container", children: [_jsx("h2", { className: "ws-formScreen-title", children: "Edit Website Styles" }), _jsxs("div", { className: "add-reset-form", children: [_jsx("h3", { className: "ws-form-title", children: "Reset All Website Styles:" }), _jsx(CIFormButton, { text: isLoading ? 'Processing...' : 'Reset', color: "primary", onClick: handleCreateOrResetCI, disabled: isLoading }), isError && _jsx(FormMessage, { message: isError, level: "error" }), isSuccess && (_jsx(FormMessage, { message: "New Company Information created/reset!", level: "success" })), isLoading && _jsx(Loader, { size: "small" })] }), _jsx(EditGeneralStylesForm, {}), _jsx(EditHeaderFooterStylesForm, {}), _jsx(EditAdminStylesForm, {})] }));
};
export default AdminEditWebsiteStyles;

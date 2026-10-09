import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSelectWebsiteStyles, useSelectWebsiteStylesStatus, useUpdateWebsiteStyles, } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../../company/companyInfo/components/CIFormButton';
import FormMessage from '../../../general/components/FormMessage';
import Loader from '../../../general/components/Loader';
import SaveButton from './SaveButton';
import '../css/websiteStylesForms.css';
const EditAdminStylesForm = () => {
    const websiteStyles = useSelectWebsiteStyles();
    const updateWebsiteStylesHook = useUpdateWebsiteStyles();
    const status = useSelectWebsiteStylesStatus();
    const { backgroundColor, wordColor, sideBar } = websiteStyles.admin;
    const { colors, fonts } = websiteStyles.saves;
    const [bgColor, setBgColor] = useState(backgroundColor || '');
    const [wColor, setWColor] = useState(wordColor || '');
    const [sideBarBGColor, setSideBarBGColor] = useState(sideBar.backgroundColor || '');
    const [sideBarWColor, setsideBarWColor] = useState(sideBar.wordColor || '');
    const [colorList, setColorList] = useState(colors || []);
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const handleReset = () => {
        setBgColor('#ffffff');
        setWColor('#0f0f75');
        setSideBarBGColor('#0AB7DA');
        setsideBarWColor('#000000');
    };
    const handleSave = async (savedValue) => {
        if (colorList.includes(savedValue))
            return;
        const updatedList = [...colorList, savedValue];
        setColorList(updatedList);
        const dataToUpdate = {
            saves: {
                colors: updatedList,
                fonts: fonts,
            },
        };
        try {
            await updateWebsiteStylesHook(websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles._id, dataToUpdate);
            console.log(`${savedValue} saved to DB!`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error saving ${savedValue}:`, error.message);
                setIsError(error.message);
            }
            else {
                console.error(`Unexpected error saving ${savedValue}:`, error);
                setIsError('An unexpected error occurred.');
            }
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        const dataToUpdate = {
            admin: {
                backgroundColor: bgColor,
                wordColor: wColor,
                sideBar: {
                    backgroundColor: sideBarBGColor,
                    wordColor: sideBarWColor,
                },
            },
        };
        try {
            setIsSuccess(false);
            console.log('datatoupdate', dataToUpdate);
            await updateWebsiteStylesHook(websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles._id, dataToUpdate);
            if (status === EnumStatus.Fail) {
                throw new Error('This is not working');
            }
            if (status === EnumStatus.Success) {
                setIsSuccess(true);
                console.log('admin styles updated!');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error updating admin styles:', error.message);
                setIsError(error.message);
            }
            else {
                console.error('Unexpected error:', error);
                setIsError('An unexpected error occurred.');
            }
        }
    };
    return (_jsxs("div", { className: "ws-form-container", children: [_jsx("h3", { className: "ws-form-title", children: "Update Admin Styles:" }), !(websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles.admin) ? (_jsx("div", { children: "Please go to Reset Webiste Styles" })) : (_jsxs("form", { className: "ws-form", onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: "ws-form-input-with-example-sidebar", children: [_jsxs("div", { className: "ws-example", style: {
                                    backgroundColor: sideBarBGColor,
                                    color: sideBarWColor,
                                    width: '9rem',
                                }, children: [_jsx("h2", { className: "ws-example-title", style: {
                                            marginTop: '4px',
                                            marginBottom: '4px',
                                        }, children: "SideBarTitle" }), _jsx("p", { className: "ws-example-words", style: { fontWeight: 'bold' }, children: "sidebar option" })] }), _jsxs("div", { className: "ws-form-input", style: { backgroundColor: bgColor, color: wColor }, children: [_jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "bgColor", className: "ws-label", children: "Admin BackGround Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: bgColor, onChange: (e) => setBgColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(bgColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "bgcolorlist", value: bgColor, onChange: (e) => setBgColor(e.target.value), style: { width: '100px', backgroundColor: bgColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "wColor", className: "ws-label", children: "Admin Word Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: wColor, onChange: (e) => setWColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(wColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "wordcolorlist", value: wColor, onChange: (e) => setWColor(e.target.value), style: { width: '100px', backgroundColor: wColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "bgColor", className: "ws-label", children: "Admin Sidebar BackGround Color:" }), _jsx("input", { type: "color", id: "sideBarBGColorchoose", value: sideBarBGColor, onChange: (e) => setSideBarBGColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(sideBarBGColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "sbbgcolorlist", value: sideBarBGColor, onChange: (e) => setSideBarBGColor(e.target.value), style: { width: '100px', backgroundColor: sideBarBGColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "sideBarWColor", className: "ws-label", children: "Admin Sidebar Word Color:" }), _jsx("input", { type: "color", id: "sideBarWColorchoose", value: sideBarWColor, onChange: (e) => setsideBarWColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(sideBarWColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "sbwordcolorlist", value: wColor, onChange: (e) => setsideBarWColor(e.target.value), style: { width: '100px', backgroundColor: wColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] })] })] }), _jsxs("div", { className: "ws-button-and-message-section", children: [_jsxs("div", { className: "ws-form-buttons", children: [_jsx(CIFormButton, { text: "Edit", color: "primary" }), _jsx(CIFormButton, { text: "Reset", color: "success", onClick: handleReset })] }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "Admin Styles Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }))] }));
};
export default EditAdminStylesForm;

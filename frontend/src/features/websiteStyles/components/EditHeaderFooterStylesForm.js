import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSelectWebsiteStyles, useSelectWebsiteStylesStatus, useUpdateWebsiteStyles, } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../../company/companyInfo/components/CIFormButton';
import FormMessage from '../../../general/components/FormMessage';
import Loader from '../../../general/components/Loader';
import SaveButton from './SaveButton';
import CompanyLogo from '../../../general/components/CompanyLogo';
import { navItemsForEditingExample } from '../../../general/utils/navItems';
import '../css/websiteStylesForms.css';
const EditHeaderFooterStylesForm = () => {
    const websiteStyles = useSelectWebsiteStyles();
    const updateWebsiteStylesHook = useUpdateWebsiteStyles();
    const status = useSelectWebsiteStylesStatus();
    console.log('webiste', websiteStyles);
    const { backgroundColor, fontSize, wordColor, dropdown } = websiteStyles.headerAndFooter;
    const { colors, fonts } = websiteStyles.saves;
    const [bgColor, setBgColor] = useState(backgroundColor || '');
    const [wColor, setWColor] = useState(wordColor || '');
    const [wSize, setWSize] = useState(fontSize || '');
    const [dropDownBGColor, setDropDownBGColor] = useState(dropdown.backgroundColor || '');
    const [dropDownWColor, setDropDownWColor] = useState(dropdown.wordColor || '');
    const [dropDownHoverColor, setDropDownHoverColor] = useState(dropdown.hoverColor || '');
    const [colorList, setColorList] = useState(colors || []);
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const handleReset = () => {
        setBgColor('#d4d1d1');
        setWColor('#000000');
        setWSize('16px');
        setDropDownBGColor('#dddcdc');
        setDropDownWColor('#000000');
        setDropDownHoverColor('#aaa7a7');
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
            headerAndFooter: {
                backgroundColor: bgColor,
                fontSize: wSize,
                wordColor: wColor,
                dropdown: {
                    backgroundColor: dropDownBGColor,
                    wordColor: dropDownWColor,
                    hoverColor: dropDownHoverColor,
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
                console.log('header/footer styles updated!');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error updating header/footer styles:', error.message);
                setIsError(error.message);
            }
            else {
                console.error('Unexpected error:', error);
                setIsError('An unexpected error occurred.');
            }
        }
    };
    return (_jsxs("div", { className: "ws-form-container", children: [_jsx("h3", { className: "ws-form-title", children: "Update Header & Footer Styles:" }), !(websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles.headerAndFooter) ? (_jsx("div", { children: "Please go to Reset Webiste Styles" })) : (_jsxs("form", { className: "ws-form", onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: "ws-form-input-with-example", children: [_jsx("div", { className: "ws-example", style: {
                                    backgroundColor: bgColor,
                                    fontSize: wSize,
                                    color: wColor,
                                }, children: _jsxs("nav", { className: "ws-example-navbar", children: [_jsx("div", { className: "logo-container", children: _jsx(CompanyLogo, {}) }), _jsxs("ul", { className: "navbar-list", children: [navItemsForEditingExample.map((item, index) => (_jsxs("li", { className: "navbar-item", children: [item.name, item.dropdown && (_jsx("ul", { className: "dropdown-menu", style: {
                                                                backgroundColor: dropDownBGColor,
                                                                color: dropDownWColor,
                                                            }, children: item.dropdown.map((dropdownItem, dropdownIndex) => (_jsx("li", { className: "dropdown-item", children: dropdownItem.name }, dropdownIndex))) }))] }, index))), _jsx("li", { className: "user-button", children: _jsx(CIFormButton, { text: "Login", color: "primary" }) })] })] }) }), _jsxs("div", { className: "ws-form-input", children: [_jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "bgColor", className: "ws-label", children: "Header/Footer BackGround Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: bgColor, onChange: (e) => setBgColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(bgColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "bgcolorlist", value: bgColor, onChange: (e) => setBgColor(e.target.value), style: { width: '100px', backgroundColor: bgColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "wColor", className: "ws-label", children: "Header/Footer Word Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: wColor, onChange: (e) => setWColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(wColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "wordcolorlist", value: wColor, onChange: (e) => setWColor(e.target.value), style: { width: '100px', backgroundColor: wColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-size-input", children: [_jsx("label", { htmlFor: "wordSize", children: "Header/Footer Word Size:" }), _jsx("input", { type: "number", step: "any", value: (wSize === null || wSize === void 0 ? void 0 : wSize.replace('px', '')) || '', onChange: (e) => setWSize(`${e.target.value}px`) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "dropdownBgColor", className: "ws-label", children: "Dropdown BackGround Color:" }), _jsx("input", { type: "color", id: "dropdownBgColor", value: dropDownBGColor, onChange: (e) => setDropDownBGColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(dropDownBGColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "dropdownbgcolorlist", value: bgColor, onChange: (e) => setDropDownBGColor(e.target.value), style: { width: '100px', backgroundColor: dropDownBGColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "dropdownWColor", className: "ws-label", children: "Dropdown Word Color:" }), _jsx("input", { type: "color", id: "dropdownWColorchoose", value: dropDownWColor, onChange: (e) => setDropDownWColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(dropDownWColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "colorlist", value: dropDownWColor, onChange: (e) => setDropDownWColor(e.target.value), style: { width: '100px', backgroundColor: dropDownWColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "dropDownHoverColor", className: "ws-label", children: "Dropdown Hover Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: dropDownHoverColor, onChange: (e) => setDropDownHoverColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(dropDownHoverColor) }), _jsx("p", { children: "or" }), _jsx("select", { id: "dropDownHoverColorList", value: dropDownHoverColor, onChange: (e) => setDropDownHoverColor(e.target.value), style: {
                                                    width: '100px',
                                                    backgroundColor: dropDownHoverColor,
                                                }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] })] })] }), _jsxs("div", { className: "ws-button-and-message-section", children: [_jsxs("div", { className: "ws-form-buttons", children: [_jsx(CIFormButton, { text: "Edit", color: "primary" }), _jsx(CIFormButton, { text: "Reset", color: "success", onClick: handleReset })] }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "Header/Footer Styles Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }))] }));
};
export default EditHeaderFooterStylesForm;

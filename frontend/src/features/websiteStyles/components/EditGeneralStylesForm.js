import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import FontPicker from 'font-picker-react';
import { useSelectWebsiteStyles, useSelectWebsiteStylesStatus, useUpdateWebsiteStyles, } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../../company/companyInfo/components/CIFormButton';
import FormMessage from '../../../general/components/FormMessage';
import Loader from '../../../general/components/Loader';
import SaveButton from './SaveButton';
import '../css/websiteStylesForms.css';
const googleFontsApiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const EditGeneralStylesForm = () => {
    const websiteStyles = useSelectWebsiteStyles();
    const updateWebsiteStylesHook = useUpdateWebsiteStyles();
    const status = useSelectWebsiteStylesStatus();
    console.log('webiste', websiteStyles);
    const { backgroundColor, font, wordColor, wordSize, titleSize } = websiteStyles.general;
    const { colors, fonts } = websiteStyles.saves;
    const [bgColor, setBgColor] = useState(backgroundColor || '');
    const [fontFamily, setFontFamily] = useState(font || '');
    const [wColor, setWColor] = useState(wordColor || '');
    const [wSize, setWSize] = useState(wordSize || '');
    const [tSize, setTSize] = useState(titleSize || '');
    const [colorList, setColorList] = useState(colors || []);
    const [fontList, setFontList] = useState(fonts || []);
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const handleReset = () => {
        setBgColor('#ffffff');
        setFontFamily("'Serif', sans-serif");
        setWColor('#0f0f75');
        setWSize('16px');
        setTSize('48px');
    };
    const handleSave = async (savedValue, savedType) => {
        if (!savedValue)
            return;
        const isColor = savedType === 'color';
        const list = isColor ? colorList : fontList;
        if (list.includes(savedValue))
            return;
        const updatedList = [...list, savedValue];
        if (isColor) {
            setColorList(updatedList);
        }
        else {
            setFontList(updatedList);
        }
        const dataToUpdate = {
            saves: {
                colors: isColor ? updatedList : colorList,
                fonts: !isColor ? updatedList : fontList,
            },
        };
        console.log('website styles id: ', websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles._id);
        try {
            await updateWebsiteStylesHook(websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles._id, dataToUpdate);
            console.log(`${savedType} saved to DB!`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error saving ${savedType}:`, error.message);
                setIsError(error.message);
            }
            else {
                console.error(`Unexpected error saving ${savedType}:`, error);
                setIsError('An unexpected error occurred.');
            }
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        const dataToUpdate = {
            general: {
                backgroundColor: bgColor,
                font: fontFamily,
                wordColor: wColor,
                wordSize: wSize,
                titleSize: tSize,
            },
            saves: {
                colors: colorList,
                fonts: fontList,
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
                console.log('general website styles updated!');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error updating general website styles:', error.message);
                setIsError(error.message);
            }
            else {
                console.error('Unexpected error:', error);
                setIsError('An unexpected error occurred.');
            }
        }
    };
    return (_jsxs("div", { className: "ws-form-container", children: [_jsx("h3", { className: "ws-form-title", children: "Update General Styles:" }), !(websiteStyles === null || websiteStyles === void 0 ? void 0 : websiteStyles.general) ? (_jsx("div", { children: "Please go to Reset Webiste Styles" })) : (_jsxs("form", { className: "ws-form", onSubmit: submitHandler, noValidate: true, children: [_jsxs("div", { className: "ws-form-input-with-example", children: [_jsxs("div", { className: "ws-example", style: {
                                    backgroundColor: bgColor,
                                    fontFamily: fontFamily,
                                    color: wColor,
                                }, children: [_jsx("h4", { className: "ws-example-title", style: {
                                            fontSize: tSize,
                                            marginTop: '4px',
                                            marginBottom: '4px',
                                        }, children: "Title" }), _jsx("p", { className: "ws-example-words", style: { fontSize: wSize }, children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod vel velit dolores, accusamus dolor ratione consectetur ad eligendi, amet beatae est doloremque debitis. Vel praesentium, commodi reiciendis qui ab non!" })] }), _jsxs("div", { className: "ws-form-input", children: [_jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "bgColor", className: "ws-label", children: "BackGround Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: bgColor, onChange: (e) => setBgColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(bgColor, 'color') }), _jsx("p", { children: "or" }), _jsx("select", { id: "bgcolorlist", value: bgColor, onChange: (e) => setBgColor(e.target.value), style: { width: '100px', backgroundColor: bgColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-color-input-form", children: [_jsx("label", { htmlFor: "wColor", className: "ws-label", children: "Word Color:" }), _jsx("input", { type: "color", id: "bgcolorchoose", value: wColor, onChange: (e) => setWColor(e.target.value) }), _jsx(SaveButton, { onClick: () => handleSave(wColor, 'color') }), _jsx("p", { children: "or" }), _jsx("select", { id: "wordcolorlist", value: wColor, onChange: (e) => setWColor(e.target.value), style: { width: '100px', backgroundColor: wColor }, children: colorList.map((color) => (_jsx("option", { value: color, style: { backgroundColor: color }, children: color }, color))) })] }), _jsxs("div", { className: "ws-font-input-form", children: [_jsx("label", { htmlFor: "companyName", className: "ci-label", children: "Font:" }), _jsx(FontPicker, { apiKey: googleFontsApiKey, activeFontFamily: fontFamily, onChange: (nextFont) => setFontFamily(nextFont.family) }), _jsx(SaveButton, { onClick: () => handleSave(fontFamily, 'font') }), _jsx("p", { children: "or" }), _jsx("select", { id: "fontlist", value: fontFamily, onChange: (e) => setWColor(e.target.value), children: fontList.map((font) => (_jsx("option", { value: font, children: _jsx("div", { children: font }) }, font))) })] }), _jsxs("div", { className: "ws-size-input", children: [_jsx("label", { htmlFor: "titleSize", children: "Title Size:" }), _jsx("input", { type: "number", step: "any", value: (tSize === null || tSize === void 0 ? void 0 : tSize.replace('px', '')) || '', onChange: (e) => setTSize(`${e.target.value}px`) })] }), _jsxs("div", { className: "ws-size-input", children: [_jsx("label", { htmlFor: "wordSize", children: "Word Size:" }), _jsx("input", { type: "number", step: "any", value: (wSize === null || wSize === void 0 ? void 0 : wSize.replace('px', '')) || '', onChange: (e) => setWSize(`${e.target.value}px`) })] })] })] }), _jsxs("div", { className: "ws-button-and-message-section", children: [_jsxs("div", { className: "ws-form-buttons", children: [_jsx(CIFormButton, { text: "Edit", color: "primary" }), _jsx(CIFormButton, { text: "Reset", color: "success", onClick: handleReset })] }), status === EnumStatus.Fail && (_jsx(FormMessage, { message: isError, level: "error" })), isSuccess && (_jsx(FormMessage, { message: "General Styles Updated!", level: "success" })), status === EnumStatus.Loading && _jsx(Loader, { size: "small" })] })] }))] }));
};
export default EditGeneralStylesForm;

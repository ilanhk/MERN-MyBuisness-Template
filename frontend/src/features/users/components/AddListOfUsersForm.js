import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCsvFile } from '../../../general/utils/uploadsApis';
import { downloadEmptyCSV, YesNoToBoolean } from '../../../general/utils/csvfunctions';
import { useCreateUser } from '../state/hooks';
import UploadFile from '../../../general/components/UploadFile';
import CIFormButton from '../../../features/company/companyInfo/components/CIFormButton';
import FormMessage from '../../../general/components/FormMessage';
const AddListOfUsersForm = () => {
    const createUserHook = useCreateUser();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    // const [successMessage, setSuccessMessage] = useState(''); // optional
    const handleDownload = () => {
        const headers = [
            'firstName',
            'lastName',
            'email',
            'password',
            'inEmailList',
            'isEmployee',
        ];
        downloadEmptyCSV(headers, 'users-template.csv');
    };
    const handleUploadUsers = async () => {
        var _a, _b;
        setIsLoading(true);
        setError('');
        setProgress(0);
        // setSuccessMessage('');
        try {
            let listOfUsers = [];
            console.log('file uploading: ', file);
            if (file) {
                try {
                    const data = await uploadCsvFile(file);
                    console.log('data from upload', data);
                    listOfUsers = data;
                    console.log('listOfUsers', listOfUsers);
                }
                catch (err) {
                    console.error('Error uploading users:', err);
                    setError(err instanceof Error ? err.message : 'An unexpected error occurred while uploading users.');
                    return;
                }
            }
            const correctedListOfUsers = listOfUsers.map((user) => (Object.assign(Object.assign({}, user), { inEmailList: YesNoToBoolean(user.inEmailList), isEmployee: YesNoToBoolean(user.isEmployee) })));
            console.log('corrected user list: ', correctedListOfUsers);
            let hasError = false;
            for (let i = 0; i < correctedListOfUsers.length; i++) {
                const user = correctedListOfUsers[i];
                const { firstName, lastName, email, password, inEmailList, isEmployee } = user;
                const fullName = `${firstName} ${lastName}`;
                console.log('user about to add: ', user);
                try {
                    await createUserHook(firstName, lastName, fullName, email, inEmailList, password, isEmployee);
                    setProgress(Math.round(((i + 1) / correctedListOfUsers.length) * 100));
                }
                catch (err) {
                    setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) ||
                        (err === null || err === void 0 ? void 0 : err.message) ||
                        `Failed to create user: ${fullName}.`);
                    hasError = true;
                    break;
                }
            }
            if (!hasError) {
                // setSuccessMessage('All users were added successfully!');
                navigate('/admin/userlist');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Upload List of Users" }), _jsxs("p", { children: ["Upload a list of users to add via our CSV template file.", _jsx("br", {}), _jsx("br", {}), "Please keep in mind:", _jsx("br", {}), _jsx("br", {}), _jsx("strong", { children: "Password" }), " - needs to match these requirements:", _jsx("br", {}), _jsx("br", {}), "1. Not empty", _jsx("br", {}), "2. It has a length of at least 12 characters", _jsx("br", {}), "3. It contains at least one uppercase letter", _jsx("br", {}), "4. It contains at least one lowercase letter", _jsx("br", {}), "5. It contains at least one number (0-9)", _jsx("br", {}), "6. It contains at least one special character", _jsx("br", {}), _jsx("br", {}), _jsx("strong", { children: "inEmailList" }), " - Is the user subscribed to emails", _jsx("br", {}), _jsx("strong", { children: "isEmployee" }), " - Is the user an employee? If not, they are considered a customer", _jsx("br", {}), _jsx("br", {}), "Please answer this section with ", _jsx("strong", { children: "Yes" }), " or ", _jsx("strong", { children: "No" }), "."] }), _jsx("p", { children: "To download the CSV file template with all required fields, click here:" }), _jsx(CIFormButton, { text: "Download", color: "success", onClick: handleDownload }), _jsx("p", { children: "Upload the list of users here:" }), _jsx(UploadFile, { onFileChange: setFile }), _jsx("br", {}), _jsx(CIFormButton, { text: "Add Users", color: "primary", onClick: handleUploadUsers, disabled: isLoading }), isLoading && (_jsxs("div", { style: { marginTop: '1rem' }, children: [_jsxs("p", { children: ["Uploading users... ", progress, "%"] }), _jsx("div", { style: { height: '10px', backgroundColor: '#ccc', width: '100%' }, children: _jsx("div", { style: {
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: 'green',
                                transition: 'width 0.3s ease',
                            } }) })] })), error && (_jsx(FormMessage, { message: error, level: "error" }))] }));
};
export default AddListOfUsersForm;

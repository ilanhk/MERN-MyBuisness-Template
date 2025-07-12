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

  const [file, setFile] = useState<File | null>(null);
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
    setIsLoading(true);
    setError('');
    setProgress(0);
    // setSuccessMessage('');

    try {
      let listOfUsers = [];
      console.log('file uploading: ', file)

      if (file) {
        try {
          const data = await uploadCsvFile(file);
          console.log('data from upload', data);
          listOfUsers = data;

          console.log('listOfUsers', listOfUsers);
        } catch (err) {
          console.error('Error uploading users:', err);
          setError(
            err instanceof Error ? err.message : 'An unexpected error occurred while uploading users.'
          );
          return;
        }
      }

      const correctedListOfUsers = listOfUsers.map((user) => ({
        ...user,
        inEmailList: YesNoToBoolean(user.inEmailList),
        isEmployee: YesNoToBoolean(user.isEmployee),
      }));

      console.log('corrected user list: ', correctedListOfUsers)

      let hasError = false;

      for (let i = 0; i < correctedListOfUsers.length; i++) {
        const user = correctedListOfUsers[i];
        const { firstName, lastName, email, password, inEmailList, isEmployee } = user;
        const fullName = `${firstName} ${lastName}`;

        console.log('user about to add: ', user)

        try {
          await createUserHook(
            firstName,
            lastName,
            fullName,
            email,
            inEmailList,
            password,
            isEmployee
          );

          setProgress(Math.round(((i + 1) / correctedListOfUsers.length) * 100));
        } catch (err) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            `Failed to create user: ${fullName}.`
          );
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        // setSuccessMessage('All users were added successfully!');
        navigate('/admin/userlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload List of Users</h2>
      <p>
        Upload a list of users to add via our CSV template file.<br /><br />
        Please keep in mind:<br /><br />

          <strong>Password</strong> - needs to match these requirements:<br /><br />
                
            1. Not empty<br />
            2. It has a length of at least 12 characters<br />
            3. It contains at least one uppercase letter<br />
            4. It contains at least one lowercase letter<br />
            5. It contains at least one number (0-9)<br />
            6. It contains at least one special character<br /><br />
        
        <strong>inEmailList</strong> - Is the user subscribed to emails<br />
        <strong>isEmployee</strong> - Is the user an employee? If not, they are considered a customer<br /><br />
        Please answer this section with <strong>Yes</strong> or <strong>No</strong>.
      </p>
      <p>
        To download the CSV file template with all required fields, click here:
      </p>
      <CIFormButton text="Download" color="success" onClick={handleDownload} />

      <p>Upload the list of users here:</p>
      <UploadFile onFileChange={setFile} />
      <br/>
      <CIFormButton
        text="Add Users"
        color="primary"
        onClick={handleUploadUsers}
        disabled={isLoading}
      />

      {isLoading && (
        <div style={{ marginTop: '1rem' }}>
          <p>Uploading users... {progress}%</p>
          <div style={{ height: '10px', backgroundColor: '#ccc', width: '100%' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: 'green',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <FormMessage message={error} level="error" />
      )}

      {/* Uncomment if you want a success message (before navigation) */}
      {/* {successMessage && (
        <FormMessage message={successMessage} level="success" />
      )} */}
    </div>
  );
};

export default AddListOfUsersForm;

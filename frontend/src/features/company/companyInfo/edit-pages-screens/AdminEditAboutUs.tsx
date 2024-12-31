import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useUpdateCompanyInfo, useSelectCompanyInfo, useSelectCompanyInfoStatus } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import CIFormButton from '../components/CIFormButton';
import UploadFile from '../../../../general/components/UploadFile';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import '../css/companyInfoForms.css';

const AdminEditAboutUs = () => {
  const companyInfo = useSelectCompanyInfo();
  const status = useSelectCompanyInfoStatus();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  const aboutInfo = companyInfo?.about;
  const { title, description, image } =aboutInfo;

  // Use state variables to manage form inputs
  const [aboutTitle, setAboutTitle] = useState<string | null>(title || '');
  const [aboutDescription, setAboutDescription] = useState<string | null>(description || '');
  const [file, setFile] = useState<File | null>(null);
  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);



  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    let updatedImageURL = image; 
  
    if (file) {
      try {
        const data = await uploadSingleFile(file);
        console.log('data from upload', data);
        updatedImageURL = data; // Use the temporary variable
      } catch (err) {
        console.error('Error uploading file:', err);
        setIsError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        return; // Exit on error
      }
    }
  
    const dataToUpdate = {
      about: {
        title: aboutTitle || null,
        description: aboutDescription || null,
        image: updatedImageURL || null, 
      },
    };
  
    try {
      setIsSuccess(false);
  
      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      console.log('update about', update);
  
      if (status === EnumStatus.Fail) {
        throw new Error('This is not working');
      }
  
      if (status === EnumStatus.Success) {
        setIsSuccess(true);
        console.log('Company info updated!');
      }
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating company info:', error.message);
        setIsError(error.message);
      } else {
        console.error('Unexpected error:', error);
        setIsError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="ci-form-container">
      <h2 className="ci-formScreen-title">Edit About Us page</h2>
      {!aboutInfo ? (
        <div>Please go to Company Information on the left menu and add company info</div>
      ) : (
        <form className="ci-form" onSubmit={submitHandler} noValidate>
          <div className='ci-form-with-button-and-message-section'>
            <div className='ci-form-input-section'>
              <div className="ci-form-input">
                <label htmlFor="aboutTitle" className='ci-label'>Title: </label>
                <TextField
                  id="aboutTitle"
                  value={aboutTitle || ''}
                  onChange={(e) => setAboutTitle(e.target.value)}
                />
              </div>


              <div className="ci-form-input">
                <label htmlFor="aboutDescription" className='ci-label'>Description: </label>
                <TextField
                  id="aboutDescription"
                  value={aboutDescription || ''}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  multiline
                  maxRows={100}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="aboutImage" className="ci-label">
                  About Us Image:
                </label>
                <UploadFile onFileChange={setFile} />
              </div>
            </div>
            <div className='ci-button-and-message-section'>
              <CIFormButton text='Edit' color='primary'/>
              {status === EnumStatus.Fail  && (
                <FormMessage message={isError} level="error"/>
              )}
              {isSuccess && (
                <FormMessage message="About Us Updated!" level="success"/>
              )}
              {status === EnumStatus.Loading && <Loader size="small" />}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminEditAboutUs;
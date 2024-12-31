import { useState } from 'react';
import TextField from '@mui/material/TextField';
import {useSelectCompanyInfo, useSelectCompanyInfoStatus, useUpdateCompanyInfo } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import CIFormButton from '../components/CIFormButton';
import UploadFile from '../../../../general/components/UploadFile';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import '../css/companyInfoForms.css';

const AdminEditHomePage = () => {
  const companyInfo = useSelectCompanyInfo();
  const status = useSelectCompanyInfoStatus();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  // Safely access companyInfo.home
  const homeInfo = companyInfo?.home;
  const valueProposition = homeInfo?.valueProposition;

  // Use state variables to manage form inputs
  const [proposition, setProposition] = useState<string | null>(valueProposition.proposition || '');
  const [callToAction, setCallToAction] = useState<string | null>(valueProposition.callToAction || '');
  const [file, setFile] = useState<File | null>(null);
  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    let updatedImageURL = valueProposition.image; 
  
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
      home: {
        valueProposition: {
          proposition: proposition || null, // Ensure null for empty fields
          callToAction: callToAction || null,
          image: updatedImageURL || null, 
        },
        customerSection: homeInfo.customerSection, // Preserve existing data or default to empty
      },
    };

    try {
      setIsSuccess(false);
  
      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      console.log('update homepage', update);

      if (status === EnumStatus.Fail) {
        throw new Error('This is not working');
      }
  
      if (status === EnumStatus.Success) {
        setIsSuccess(true);
        console.log('Company info updated!');
      }


    } catch (error: unknown) {
      if (error instanceof Error) {
          console.error("Error updating company info:", error.message);
          setIsError(error.message);
      } else {
          console.error("Unexpected error:", error);
          setIsError("An unexpected error occurred.");
      }
    };

  };

  return (
    <div className="ci-form-container">
      <h2 className="ci-formScreen-title">Edit Homepage</h2>
      {!companyInfo?.home ? (
        <div>Please go to Company Information on the left menu and add company info</div>
      ) : (
        <form className="ci-form" onSubmit={submitHandler} noValidate>
          <h4 className="ci-form-title">Edit Value Proposition and Call to Action</h4>
          <div className='ci-form-with-button-and-message-section'>
            <div className='ci-form-input-section'>
              <div className="ci-form-input">
                <label htmlFor="proposition" className='ci-label'>Proposition: </label>
                <TextField
                  id="proposition"
                  value={proposition || ''}
                  onChange={(e) => setProposition(e.target.value)}
                  multiline
                  maxRows={4}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="callToAction" className='ci-label'>Call to Action: </label>
                <TextField
                  id="callToAction"
                  value={callToAction || ''}
                  onChange={(e) => setCallToAction(e.target.value)}
                  multiline
                  maxRows={4}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="aboutImage" className="ci-label">
                  Proposition Image:
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
                <FormMessage message="Proposition Updated!" level="success"/>
              )}
              {status === EnumStatus.Loading && <Loader size="small" />}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminEditHomePage;

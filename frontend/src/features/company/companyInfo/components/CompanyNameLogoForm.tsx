import { useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  useSelectCompanyInfo,
  useSelectCompanyInfoStatus,
  useUpdateCompanyInfo,
} from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import UploadFile from '../../../../general/components/UploadFile';
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";

const CompanyNameLogoForm = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();
  const status = useSelectCompanyInfoStatus();

  const info = companyInfo?.company;
  const { name, logoImage } = info;
  

  const [companyName, setCompanyName] = useState<string | null>( name || '');
  const [file, setFile] = useState<File | null>(null);
  
  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let updatedImageURL = logoImage; 
  
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
    };

    const dataToUpdate = {
      company: {
        name: companyName || null,
        logoImage: updatedImageURL || null,
      },
    };

    try {
      setIsSuccess(false);

      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      console.log('update company logo and name', update);


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
      <h3 className="ci-form-title">Update Company Name and Logo:</h3>
      {!companyInfo?.home ? (
        <div>Please go to Company Information on the left menu and add company info</div>
      ) : (
        <form className="ci-form" onSubmit={submitHandler} noValidate>
          <div className="ci-form-with-button-and-message-section">
            <div className="ci-form-input-section">
              <div className="ci-form-input">
                <label htmlFor="companyName" className="ci-label">
                  Company Name:
                </label>
                <TextField
                  id="companyName"
                  value={companyName || ''}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="companyLogo" className="ci-label">
                  Company Logo:
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
                <FormMessage message="Name and/or Logo Updated!" level="success"/>
              )}
              {status === EnumStatus.Loading && <Loader size="small" />}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyNameLogoForm;

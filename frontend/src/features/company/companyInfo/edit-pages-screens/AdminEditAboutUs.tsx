import { useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  useSelectCompanyInfo,
} from '../state/hooks';
import { useUpdateCompanyInfo } from '../state/hooks';
import getReduxStatus from "../../../../general/utils/getReduxStatus";
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import '../css/companyInfoForms.css';

const AdminEditAboutUs = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  const aboutInfo = companyInfo?.about || {};
  const { title, description, image} =aboutInfo;

  // Use state variables to manage form inputs
  const [aboutTitle, setAboutTitle] = useState<string | null>(title || '');
  const [aboutDescription, setAboutDescription] = useState<string | null>(description || '');
  const [aboutImageURL, setAboutImageURL] = useState<string | null>(image || '');
  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use state directly for form data
    const dataToUpdate = {
      about: {
        title: aboutTitle || null,
        description: aboutDescription || null,
        image: aboutImageURL || null,
      }
    };

    try {
      setIsSuccess(false);
      setIsLoading(true); 
      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      const updateReduxStatus = getReduxStatus(update.type);

      if(updateReduxStatus === 'fulfilled'){
        setIsSuccess(true)
        console.log("Company Info on Homepage Updated!!");
      }


    } catch (error: unknown) {
      if (error instanceof Error) {
          console.error("Error updating company info:", error.message);
          setIsError(error.message);
      } else {
          console.error("Unexpected error:", error);
          setIsError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    };

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
            </div>
            <div className='ci-button-and-message-section'>
              <CIFormButton text='Edit' color='primary'/>
              {isError  && (
                <FormMessage message={isError} level="error"/>
              )}
              {isSuccess && (
                <FormMessage message="Proposition and Call to Action Updated!" level="success"/>
              )}
              { isLoading && (
                <Loader size="small" />
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminEditAboutUs;
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

const AdminEditContactUs = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  const contactInfo = companyInfo?.contactUs || {};
  const { title, description, email, phone, address, socialMedia } =contactInfo;

  // Use state variables to manage form inputs
  const [contactTitle, setContactTitle] = useState<string | null>(title || '');
  const [contactDescription, setContactDescription] = useState<string | null>(description || '');

  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use state directly for form data
    const dataToUpdate = {
      contactUs: {
        title: contactTitle || null,
        description: contactDescription || null,
        email,
        phone,
        address,
        socialMedia,
      },
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
      <h2 className="ci-formScreen-title">Edit Contact Us page</h2>
      {!contactInfo ? (
        <div>Please go to Company Information on the left menu and add company info</div>
      ) : (
        <form className="ci-form" onSubmit={submitHandler} noValidate>
          <div className='ci-form-with-button-and-message-section'>
            <div className='ci-form-input-section'>
              <div className="ci-form-input">
                <label htmlFor="contactTitle" className='ci-label'>Title: </label>
                <TextField
                  id="contactTitle"
                  value={contactTitle || ''}
                  onChange={(e) => setContactTitle(e.target.value)}

                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="contactDescription" className='ci-label'>Description: </label>
                <TextField
                  id="contactDescription"
                  value={contactDescription || ''}
                  onChange={(e) => setContactDescription(e.target.value)}
                  multiline
                  maxRows={2}
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

export default AdminEditContactUs;
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

const AdminEditHomePage = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  // Safely access companyInfo.home
  const homeInfo = companyInfo?.home || {};
  const valueProposition = homeInfo?.valueProposition || {};

  // Use state variables to manage form inputs
  const [proposition, setProposition] = useState<string | null>(valueProposition.proposition || '');
  const [callToAction, setCallToAction] = useState<string | null>(valueProposition.callToAction || '');
  const [propoImageURL, setPropoImageURL] = useState<string | null>(valueProposition.image || '');
  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use state directly for form data
    const dataToUpdate = {
      home: {
        valueProposition: {
          proposition: proposition || null, // Ensure null for empty fields
          callToAction: callToAction || null,
          image: propoImageURL || null,
        },
        customerSection: homeInfo.customerSection || {}, // Preserve existing data or default to empty
      },
    };

    try {
      setIsSuccess(false);
      setIsLoading(true); 
      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      console.log(update.type)
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
  );
};

export default AdminEditHomePage;

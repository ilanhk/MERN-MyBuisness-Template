import { useState } from "react";
// import { Checkmark } from 'react-checkmark'
import { 
  useCreateCompanyInfo, 
  useDeleteCompanyInfo, 
  useSelectCompanyInfo
} from "../state/hooks";
import getReduxStatus from "../../../../general/utils/getReduxStatus";
import CIFormButton from "../components/CIFormButton";
import Loader from "../../../../general/components/Loader";
import FormMessage from "../../../../general/components/FormMessage";



const AdminEditCompanyInfo = () => {
  const createCompanyInfoHook = useCreateCompanyInfo();
  const deleteCompanyInfoHook = useDeleteCompanyInfo();
  const companyInfo = useSelectCompanyInfo();
  const [isLoading, setIsLoading] = useState(false); // Local loading state for button interaction
  const [isError, setIsError] = useState('');
  const [isSuccess, setisSuccess] = useState(false);

  const handleCreateOrResetCI = async () => {
    try {
      setisSuccess(false);
      setIsLoading(true);

      // Check if the company info exists
      if (companyInfo?.home) {
        console.log("Deleting existing company info...");
        await deleteCompanyInfoHook(companyInfo._id);
      };

      console.log("Creating new company info...");
      const create = await createCompanyInfoHook();
      
      const createReduxStatus = getReduxStatus(create.type)

      if(createReduxStatus === 'fulfilled'){
        setisSuccess(true)
      }else{
        setisSuccess(false)
      };


      console.log("Company info successfully reset/created.");
    } catch (error: unknown) {
      if (error instanceof Error) {
          console.error("Error creating/resetting company info:", error.message);
          setIsError(error.message);
      } else {
          console.error("Unexpected error:", error);
          setIsError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings container">
      <h2>Edit Company Information</h2>
      <div className="add-or-reset-ci-section">
        <h3>Add or Reset Company Information:</h3>
        <CIFormButton
          text={isLoading ? "Processing..." : "Add/Reset"}
          color="primary"
          onClick={handleCreateOrResetCI}
          disabled={isLoading}
        />
        {isError  && (
          <FormMessage message={isError} level="error"/>
        )}
        {isSuccess && (
          <FormMessage message="New Company Information created/reset!" level="success"/>
        )}
        { isLoading && (
          <Loader size="small" />
        )}
      </div>

      <div className="update-company-name-and-logo">
        <h3>Update Company Name and Logo:</h3>
      </div>

      <div className="update-company-contactInfo">
        <h3>Update Company contact Information:</h3>
      </div>

      <div className="update-company-name-and-logo">
        <h3>Update the Company Name and Logo:</h3>
      </div>
    </div>
  );
};

export default AdminEditCompanyInfo;

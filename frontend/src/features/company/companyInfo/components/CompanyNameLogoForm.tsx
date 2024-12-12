import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  useSelectCompanyInfo,
  useUpdateCompanyInfo,
} from '../state/hooks';
import { uploadImage } from '../../../../general/utils/uploadsApis';
import getReduxStatus from '../../../../general/utils/getReduxStatus';
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";

const CompanyNameLogoForm = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  const info = companyInfo?.company || {};
 
  

  const [companyName, setCompanyName] = useState<string | null>( info.name || '');
  const [imgUrl, setImgUrl] = useState<string | null>( info.logoImage || '');
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null); // Handle File
  
  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      console.log('file: ', file)
      setLogoImageFile(file);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!logoImageFile) {
      setIsError('Please select an image to upload.');
      return;
    };

    try {
      setIsLoading(true);
      setIsSuccess(false);

      // Send image to API
      const formData = new FormData();
      formData.append('image', logoImageFile);

      const image_url = await uploadImage(formData);
       
       console.log('from upload single image: ', image_url)

      // Now submit other form data along with the uploaded image URL
      const dataToUpdate = {
        company: {
          name: companyName || null,
          logoImage: image_url // Set the uploaded image URL
        },
      };

      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      const updateReduxStatus = getReduxStatus(update.type);

      if (updateReduxStatus === 'fulfilled') {
        setImgUrl(image_url); // Update the logo image URL in the state
        setIsSuccess(true);
        console.log("Company Info on Homepage Updated!");
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
    }
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
                <label htmlFor="callToAction" className="ci-label">
                  Upload Company Logo Image:
                </label>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the input but keep it functional
                  />
                </Button>
        
              </div>
            </div>

            <div className="ci-button-and-message-section">
              <CIFormButton text="Edit" color="primary" />
              {isError && <FormMessage message={isError} level="error" />}
              {isSuccess && <FormMessage message="Proposition and Call to Action Updated!" level="success" />}
              {isLoading && <Loader size="small" />}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyNameLogoForm;

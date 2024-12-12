import { useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  useSelectCompanyInfo,
  useUpdateCompanyInfo,
} from '../state/hooks';
import getReduxStatus from '../../../../general/utils/getReduxStatus';
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";


const CompanySocialMediaForm = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();
  const socials = companyInfo?.contactUs?.socialMedia || {
  linkedin: '',
  facebook: '',
  instagram: '',
  twitter: '',
  tiktok: '',
  youtube: '',
  amazon: '',
  aliexpress: '',
};

  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [linkedinLink, setLinkedinLink] = useState<string | null>( socials.linkedin || '');
  const [facebookLink, setFacebookLink] = useState<string | null>( socials.facebook || '');
  const [instagramLink, setInstagramLink] = useState<string | null>( socials.instagram || '');
  const [twitterLink, setTwitterLink] = useState<string | null>( socials.twitter || '');
  const [tiktokLink, setTiktokLink] = useState<string | null>( socials.tiktok || '');
  const [youtubeLink, setYoutubeLink] = useState<string | null>( socials.youtube || '');
  const [amazonLink, setAmazonLink] = useState<string | null>( socials.amazon || '');
  const [aliexpressLink, setAliexpressLink] = useState<string | null>( socials.aliexpress || '');


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!companyInfo?.contactUs) {
      setIsError("Company contact information is missing. Please add it first.");
      return;
    }
  
    const { title, description, email, phone, address,  } = companyInfo.contactUs;
  
    const dataToUpdate = {
      contactUs: {
        title,
        description,
        email,
        phone,
        address,
        socialMedia: {
          linkedin: linkedinLink || null,
          facebook: facebookLink || null,
          instagram: instagramLink || null,
          twitter: twitterLink || null,
          tiktok: tiktokLink || null,
          youtube: youtubeLink || null,
          amazon: amazonLink || null,
          aliexpress: aliexpressLink || null,
        },
      },
    };
  
    try {
      setIsSuccess(false);
      setIsLoading(true);
      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      const updateReduxStatus = getReduxStatus(update.type);
  
      if (updateReduxStatus === "fulfilled") {
        setIsSuccess(true);
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
    }
  };
  

  return (
    <div className="ci-form-container">
      <h3 className="ci-form-title">Update Company Social Media Links:</h3>
      {!companyInfo?.contactUs ? (
        <div>Please go to Company Information on the left menu and add company info</div>
      ) : (
        <form className="ci-form" onSubmit={submitHandler} noValidate>
          <div className="ci-form-with-button-and-message-section">
            <div className="ci-form-input-section">
              <div className="ci-form-input">
                <label htmlFor="linkedinLink" className="ci-label">
                  Linkedin Link:
                </label>
                <TextField
                  id="linkedinLink"
                  value={linkedinLink || ''}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="facebookLink" className="ci-label">
                  Facebook Link:
                </label>
                <TextField
                  id="facebookLink"
                  value={facebookLink || ''}
                  onChange={(e) => setFacebookLink(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="instagramLink" className="ci-label">
                  Instagram Link:
                </label>
                <TextField
                  id="instagramLink"
                  value={instagramLink || ''}
                  onChange={(e) => setInstagramLink(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="twitterLink" className="ci-label">
                  Twitter Link:
                </label>
                <TextField
                  id="twitterLink"
                  value={twitterLink || ''}
                  onChange={(e) => setTwitterLink(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="tiktokLink" className="ci-label">
                  TickTok Link:
                </label>
                <TextField
                  id="tiktokLink"
                  value={tiktokLink || ''}
                  onChange={(e) => setTiktokLink(e.target.value)}
                />
              </div>


              <div className="ci-form-input">
                <label htmlFor="youtubeLink" className="ci-label">
                  Youtube Link:
                </label>
                <TextField
                  id="youtubeLink"
                  value={youtubeLink || ''}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="amazonLink" className="ci-label">
                  Amazon Link:
                </label>
                <TextField
                  id="amazonLink"
                  value={amazonLink || ''}
                  onChange={(e) => setAmazonLink(e.target.value)}
                />
              </div>

              <div className="ci-form-input">
                <label htmlFor="aliexpressLink" className="ci-label">
                  Aliexpress Link:
                </label>
                <TextField
                  id="aliexpressLink"
                  value={aliexpressLink || ''}
                  onChange={(e) => setAliexpressLink(e.target.value)}
                />
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
  )
};

export default CompanySocialMediaForm;
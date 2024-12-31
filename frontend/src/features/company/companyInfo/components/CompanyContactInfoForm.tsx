import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useUpdateCompanyInfo, useSelectCompanyInfo, useSelectCompanyInfoStatus } from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../components/CIFormButton';
import FormMessage from "../../../../general/components/FormMessage";
import Loader from "../../../../general/components/Loader";
import CountrySelect from '../../../../general/components/CountrySelect';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../css/companyInfoForms.css';

type PhoneInputData = {
  dialCode: string;
  iso2: string;
  name: string;
  format?: string;
};

const CompanyContactInfoForm = () => {
  const companyInfo = useSelectCompanyInfo();
  const status = useSelectCompanyInfoStatus();
  const updateCompanyInfoHook = useUpdateCompanyInfo();

  const contactInfo = companyInfo?.contactUs;
  const { title, description, email, phone, address, socialMedia } = contactInfo;
  
  const [contactUsEmail, setContactUsEmail] = useState<string | null>(email.contact || '');
  const [websiteEmail, setWebsiteEmail] = useState<string | null>(email.website || '');
  const [countryCodeNumber, setCountryCodeNumber] = useState<string>(phone?.countryCode || '+1');
  const [phoneNumber, setPhoneNumber] = useState<string | null>(phone.phone || '');
  const [faxNumber, setFaxNumber] = useState<string | null>(phone.fax || '');


  const [addressOne, setAddressOne] = useState<string | null>(address.address1 || '');
  const [addressTwo, setAddressTwo] = useState<string | null>(address.address2 || '');
  const [addressArea, setAddressArea] = useState<string | null>(address.area || '');
  const [addressCity, setAddressCity] = useState<string | null>(address.city || '');
  const [addressCountry, setAddressCountry] = useState<string | null>(address.country || '');
  const [addressZipCode, setAddressZipCode] = useState<string | null>(address.postalCode || '');
 

  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);



  console.log('country: ', addressCountry)

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use state directly for form data
    const dataToUpdate = {
      contactUs: {
        title,
        description,
        email: {
          contact: contactUsEmail || null,
          website: websiteEmail || null,
        },
        phone: {
          countryCode: countryCodeNumber || null,
          phone: phoneNumber || null,
          fax: faxNumber || null,
        },
        address: {
          address1: addressOne || null,
          address2: addressTwo || null,
          area: addressArea || null,
          city: addressCity || null,
          country: addressCountry || null,
          postalCode: addressZipCode || null,
          fullAddress: addressOne || addressTwo || addressArea || addressCity || addressCountry || addressZipCode ? 
              `${addressOne}, ${addressTwo}, ${addressArea}, ${addressCity}, ${addressCountry}, ${addressZipCode}` : 
              null,
        },
        socialMedia,
      },
    };

    try {
      setIsSuccess(false);
      const update = await updateCompanyInfoHook(companyInfo?._id, dataToUpdate);
      console.log('update contact us', update);
  
      if (status === EnumStatus.Fail) {
        throw new Error('This is not working');
      };
  
      if (status === EnumStatus.Success) {
        setIsSuccess(true);
        console.log('Company info updated!');
      };

    
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
      <h3 className="ci-form-title">Edit Company Contact Information</h3>
      {!contactInfo ? (
        <div>Please go to Company Information on the left menu and add company info</div>
      ) : (
        <form className="ci-form" onSubmit={submitHandler} noValidate>
          <div className='ci-form-with-button-and-message-section'>
            <div className='ci-form-input-section'>
              
              <h4>Company Emails:</h4>
              <div className="ci-form-input">
                <label htmlFor="contactUsEmail" className='ci-label'>Contact Us Email: </label>
                <TextField
                  id="contactUsEmail"
                  value={contactUsEmail || ''}
                  onChange={(e) => setContactUsEmail(e.target.value)}

                />
              </div>
              <div className="ci-form-input">
                <label htmlFor="websiteEmail" className='ci-label'>Website Email: </label>
                <TextField
                  id="websiteEmail"
                  value={websiteEmail || ''}
                  onChange={(e) => setWebsiteEmail(e.target.value)}

                />
              </div>


              <h4>Company Phone Number:</h4>
              <div className="ci-form-input">
                <label htmlFor="countryCodeNumber" className='ci-label'>Country Code: </label>
                  <ReactPhoneInput
                    country={'us'} // Default country
                    value={countryCodeNumber} // Use the country code from the state
                    onChange={(code: string, data: PhoneInputData) => {
                      const fullCountryCode = data?.dialCode ? `+${data.dialCode}` : `+${code}`;
                      setCountryCodeNumber(fullCountryCode); // Always prepend with "+"
                    }}
                    inputProps={{
                      name: 'countryCodeNumber',
                      autoFocus: true,
                    }}
                    enableLongNumbers
                    disableCountryCode={false} // Allow editing country code
                    countryCodeEditable={true} // Allow users to change the country code
                  />
              </div>
              <div className="ci-form-input">
                <label htmlFor="phoneNumber" className='ci-label'>Phone: </label>
                <TextField
                  id="phoneNumber"
                  value={phoneNumber || ''}
                  onChange={(e) => setPhoneNumber(e.target.value)}

                />
              </div>
              <div className="ci-form-input">
                <label htmlFor="faxNumber" className='ci-label'>Fax: </label>
                <TextField
                  id="faxNumber"
                  value={faxNumber || ''}
                  onChange={(e) => setFaxNumber(e.target.value)}

                />
              </div>


              <h4>Company Address:</h4>
              <div className="ci-form-input">
                <label htmlFor="addressOne" className='ci-label'>Address 1: </label>
                <TextField
                  id="addressOne"
                  value={addressOne || ''}
                  onChange={(e) => setAddressOne(e.target.value)}

                />
              </div>
              <div className="ci-form-input">
                <label htmlFor="addressTwo" className='ci-label'>Address 2: </label>
                <TextField
                  id="addressTwo"
                  value={addressTwo || ''}
                  onChange={(e) => setAddressTwo(e.target.value)}

                />
              </div>
              <div className="ci-form-input">
                <label htmlFor="addressArea" className='ci-label'>Area: </label>
                <TextField
                  id="addressArea"
                  value={addressArea || ''}
                  onChange={(e) => setAddressArea(e.target.value)}

                />
              </div>
              <div className="ci-form-input">
                <label htmlFor="addressCity" className='ci-label'>City: </label>
                <TextField
                  id="addressCity"
                  value={addressCity || ''}
                  onChange={(e) => setAddressCity(e.target.value)}

                />
              </div>
              <div className="ci-form-input">
                <label htmlFor="addressCountry" className='ci-label'>Country: </label>
                <CountrySelect savedCountry={addressCountry} onCountryChange={setAddressCountry} />
              </div>
              <div className="ci-form-input">
                <label htmlFor="addressZipCode" className='ci-label'>Postal Code: </label>
                <TextField
                  id="addressZipCode"
                  value={addressZipCode || ''}
                  onChange={(e) => setAddressZipCode(e.target.value)}

                />
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
};

export default CompanyContactInfoForm;
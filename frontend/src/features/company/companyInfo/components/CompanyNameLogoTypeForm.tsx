import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import {
  useSelectCompanyInfo,
  useSelectCompanyInfoStatus,
  useUpdateCompanyInfo,
} from '../state/hooks';
import { EnumStatus } from '../state/slice';
import { uploadSingleFile } from '../../../../general/utils/uploadsApis';
import UploadFile from '../../../../general/components/UploadFile';
import CIFormButton from './CIFormButton';
import FormMessage from '../../../../general/components/FormMessage';
import Loader from '../../../../general/components/Loader';

const CompanyNameLogoTypeForm = () => {
  const companyInfo = useSelectCompanyInfo();
  const updateCompanyInfoHook = useUpdateCompanyInfo();
  const status = useSelectCompanyInfoStatus();

  const info = companyInfo?.company;
  const { name, logoImage, companyType } = info;
  const { isEcommerce, hasProducts } = companyType;

  const [companyName, setCompanyName] = useState<string | null>(name || '');
  const [file, setFile] = useState<File | null>(null);
  const [ecommerce, setEcommerce] = useState<boolean | false>(isEcommerce);
  const [products, setProducts] = useState<boolean | false>(hasProducts);

  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEcommerceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEcommerceValue = event.target.checked;
    setEcommerce(newEcommerceValue);
    if (newEcommerceValue) {
      setProducts(newEcommerceValue);
    }
  };

  const handleProductsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProducts(event.target.checked);
  };

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
        setIsError(
          err instanceof Error ? err.message : 'An unexpected error occurred.'
        );
        return; // Exit on error
      }
    }

    console.log('ecommerce b4 submited: ', ecommerce);
    console.log('products b4 submited: ', products);

    const dataToUpdate = {
      company: {
        name: companyName || null,
        logoImage: updatedImageURL || null,
        companyType: {
          isEcommerce: ecommerce,
          hasProducts: products,
        },
      },
    };

    try {
      setIsSuccess(false);

      console.log('datatoupdate', dataToUpdate);

      const update = await updateCompanyInfoHook(
        companyInfo?._id,
        dataToUpdate
      );
      console.log('update company logo, name, type', update);

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
      <h3 className="ci-form-title">Update Company Name, Logo and Type:</h3>
      {!companyInfo?.home ? (
        <div>
          Please go to Company Information on the left menu and add company info
        </div>
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

              <div className="ci-form-input">
                <label htmlFor="ecommerce" className="ci-label">
                  Is the business an Ecommerce:
                </label>
                <p>if no its a Service business</p>
                <Switch checked={ecommerce} onChange={handleEcommerceChange} />
              </div>

              <div className="ci-form-input">
                <label htmlFor="product" className="ci-label">
                  Does the business has products?:
                </label>
                <p>
                  if the business has products but is not an Ecommerce business
                  Than its a business that sells products B2B
                </p>
                <Switch checked={products} onChange={handleProductsChange} />
              </div>
            </div>

            <div className="ci-button-and-message-section">
              <CIFormButton text="Edit" color="primary" />
              {status === EnumStatus.Fail && (
                <FormMessage message={isError} level="error" />
              )}
              {isSuccess && (
                <FormMessage
                  message="Name, Logo and Company Type Updated!"
                  level="success"
                />
              )}
              {status === EnumStatus.Loading && <Loader size="small" />}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyNameLogoTypeForm;

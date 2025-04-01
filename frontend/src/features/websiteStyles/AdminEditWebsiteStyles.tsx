import { useState } from 'react';

import {
  useSelectWebsiteStyles,
  useCreateWebsiteStyles,
  useDeleteWebsiteStyles,
} from './state/hooks';
import getReduxStatus from '../../general/utils/getReduxStatus';
import CIFormButton from '../company/companyInfo/components/CIFormButton';
import Loader from '../../general/components/Loader';
import FormMessage from '../../general/components/FormMessage';
import EditGeneralStylesForm from './components/EditGeneralStylesForm';
import EditHeaderFooterStylesForm from './components/EditHeaderFooterStylesForm';
import EditAdminStylesForm from './components/EditAdminStylesForm';

const AdminEditWebsiteStyles = () => {
  const createWebsiteStylesHook = useCreateWebsiteStyles();
  const deleteWebsiteStylesHook = useDeleteWebsiteStyles();
  const websiteStyles = useSelectWebsiteStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [isSuccess, setisSuccess] = useState(false);

  const handleCreateOrResetCI = async () => {
    try {
      setisSuccess(false);
      setIsLoading(true);

      // Check if the company info exists
      if (websiteStyles) {
        console.log('Deleting existing website styles...');
        await deleteWebsiteStylesHook(websiteStyles._id);
      }

      console.log('Creating new website styles...');
      const create = await createWebsiteStylesHook();

      const createReduxStatus = getReduxStatus(create.type);

      if (createReduxStatus === 'fulfilled') {
        setisSuccess(true);
      } else {
        setisSuccess(false);
      }

      console.log('Website styles successfully reseted.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error resetting website styles:', error.message);
        setIsError(error.message);
      } else {
        console.error('Unexpected error:', error);
        setIsError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ci-form-container">
      <h2 className="ci-formScreen-title">Edit Website Styles</h2>
      <div className="add-reset-form">
        <h3 className="ci-form-title">Reset All Website Styles:</h3>
        <CIFormButton
          text={isLoading ? 'Processing...' : 'Reset'}
          color="primary"
          onClick={handleCreateOrResetCI}
          disabled={isLoading}
        />
        {isError && <FormMessage message={isError} level="error" />}
        {isSuccess && (
          <FormMessage
            message="New Company Information created/reset!"
            level="success"
          />
        )}
        {isLoading && <Loader size="small" />}
      </div>

      <EditGeneralStylesForm />

      <EditHeaderFooterStylesForm />

      <EditAdminStylesForm />
    </div>
  );
};

export default AdminEditWebsiteStyles;

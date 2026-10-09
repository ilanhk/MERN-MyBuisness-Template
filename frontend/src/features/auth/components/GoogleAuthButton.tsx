import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleOAuth } from '../state/hooks';

type GoogleAuthButtonProps = {
  requiresDomain?: boolean;
};

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  requiresDomain = false,
}) => {
  const navigate = useNavigate();
  const googleOAuthHook = useGoogleOAuth();
  const [domainName, setDomainName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError('Google did not return a credential.');
      return;
    }

    if (requiresDomain && !domainName.trim()) {
      setError('Enter your company domain before continuing with Google.');
      return;
    }

    try {
      await googleOAuthHook(response.credential, domainName.trim() || undefined);
      navigate('/');
    } catch (requestError) {
      setError('Google authentication failed. Please try again.');
      console.error('Google authentication error:', requestError);
    }
  };

  const handleLoginError = () => {
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div>
      {requiresDomain && (
        <div className="form-input">
          <label htmlFor="google-domain">Company domain: </label>
          <input
            id="google-domain"
            type="text"
            value={domainName}
            onChange={(event) => {
              setDomainName(event.target.value);
              setError(null);
            }}
            placeholder="example.com"
            autoComplete="organization"
          />
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {requiresDomain && !domainName.trim() ? (
        <button type="button" disabled>
          Enter your company domain to continue
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          useOneTap
        />
      )}
    </div>
  );
};

export default GoogleAuthButton;

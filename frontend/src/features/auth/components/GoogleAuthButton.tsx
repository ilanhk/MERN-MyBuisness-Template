import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useGoogleOAuth } from '../state/hooks';



const GoogleAuthButton: React.FC = () => {
  const navigate = useNavigate();
  const googleOAuthHook = useGoogleOAuth();

  // This function handles the redirect after a successful login
  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        
        await googleOAuthHook(response.credential);
        // Navigate to home after successful login
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const handleLoginError = () => {
    console.error('Login failed');
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} useOneTap>
        Sign in with Google
      </GoogleLogin>
    </div>
  );
};

export default GoogleAuthButton;

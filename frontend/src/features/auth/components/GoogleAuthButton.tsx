import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL!;

const GoogleAuthButton: React.FC = () => {
  const navigate = useNavigate();

  // This function handles the redirect after a successful login
  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        // Send the credential to your backend instead of directly calling Google
        const res = await fetch(`${BASE_URL}/google/authenticate`, {
          method: 'POST',  // Change to POST to securely send the credential
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential: response.credential }),
          credentials: 'include', // Ensure cookies/session are sent
        });
  
        if (!res.ok) throw new Error('Authentication failed');
  
        const data = await res.json();
        console.log('User authenticated:', data);
  
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

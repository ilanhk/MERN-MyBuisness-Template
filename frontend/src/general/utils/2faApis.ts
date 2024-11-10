import axios from 'axios';

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL!;

export const get2faQrCode = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/2fa/generate`,
      { withCredentials: true } // This will include cookies in the request
    );
    return response.data; // Handle response data here
  } catch (error) {
    console.error('Error fetching QR code:', error);
    throw error;
  }
};


export const verify2fa = async ({ token, secret }: { token: string; secret: string }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/2fa/verify`,
      { token, secret },
      { withCredentials: true } // This will include cookies in the request
    );
    return response.data; // Handle response data here
  } catch (error) {
    console.error('Error verifying 2fa code:', error);
    throw error;
  }
};
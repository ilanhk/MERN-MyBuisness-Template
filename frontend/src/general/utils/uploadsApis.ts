import axios from 'axios';

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL!;

export const uploadImage = async (imageData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/image`,
      imageData, // Body data goes here
      {
        withCredentials: true, // Request options
      }
    );
    return response.data; // Handle response data here
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


export const uploadProductsCSV = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/csv`, {
      withCredentials: true,
    });
    return response.data; // Handle response data here
  } catch (error) {
    console.error('Error uploading product csv:', error);
    throw error;
  }
};



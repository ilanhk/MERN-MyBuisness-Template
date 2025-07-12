import axios from 'axios';

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL!;

export const uploadSingleFile = async (file: File) => {
  if (!file) return alert("Please select a file");

  const formData = new FormData();
  formData.append("file", file);
  console.log('file to be sent ', file)

  try {
    const { data } = await axios.post(`${BASE_URL}/upload/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.fileUrl;

  } catch (error) {
    console.error("Upload error", error);
  } 
};


export const uploadCsvFile = async (file: File) => {
  if (!file) return alert("Please select a CSV file");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axios.post(`${BASE_URL}/upload/csv`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.data; // 👈 list of parsed CSV rows as objects
  } catch (error) {
    console.error("CSV upload error", error);
  }
};



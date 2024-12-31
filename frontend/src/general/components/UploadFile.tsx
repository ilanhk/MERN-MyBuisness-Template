

interface FileUploadProps {
  onFileChange: (value: File) => void;
}

const FileUpload: React.FC<FileUploadProps>  = ({onFileChange}) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <input name="file" type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;

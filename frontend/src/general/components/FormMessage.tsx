import Alert from '@mui/material/Alert';
import '../css/FormMessage.css';

interface FormMessageProps {
  message: string;
  level: 'success' | 'error' | 'info' | 'warning'; // Restrict to allowed values
}

const FormMessage = ({ message, level }: FormMessageProps) => {
  return (
    <Alert severity={level} className="form-alert">
      {message}
    </Alert>
  );
};

export default FormMessage;

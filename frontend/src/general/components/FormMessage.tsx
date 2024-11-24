import Alert from '@mui/material/Alert';

interface FormMessageProps {
  message: string;
  level: 'success' | 'error' | 'info' | 'warning'; // Restrict to allowed values
}

const FormMessage = ({ message, level }: FormMessageProps) => {
  return (
    <Alert severity={level}>
      {message}
    </Alert>
  );
};

export default FormMessage;

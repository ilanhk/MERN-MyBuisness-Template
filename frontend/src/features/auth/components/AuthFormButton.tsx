import Button from '@mui/material/Button';


interface AuthButtonProps {
  text: string;
}

const AuthFormButton = ({ text }: AuthButtonProps) => {
  return  (
    <Button 
      variant="contained" 
      size="large"
      className="auth-form-button"
      type="submit"
    >
      {text}
    </Button>
  );
};

export default AuthFormButton;

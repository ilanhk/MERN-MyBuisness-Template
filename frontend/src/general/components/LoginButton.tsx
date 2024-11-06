import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  return (
    <Button 
      component={Link} 
      to="/login" 
      variant="contained" 
      size="small"
    >
      Login
    </Button>
  );
};

export default LoginButton;
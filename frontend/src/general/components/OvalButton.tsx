import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import '../css/ovalButton.css';

interface OvalButtonProps{
  path: string;
  text: string;
};

const OvalButton = ({ path, text}: OvalButtonProps) => {
  return (
    <Link to={path}>
      <Button 
        variant="contained"
        size="large"
        className='oval-button'
        >
          {text}
      </Button>
    </Link>
  )
};

export default OvalButton;
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // <-- Import the icon
import { memo } from 'react';
import { Link } from 'react-router-dom';

interface BackButtonProps {
  route: string;
}

const BackButton = ({ route }: BackButtonProps) => {
  return (
    <Link to={route} style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        color="info"
        size="small"
        className="back-button"
        startIcon={<ArrowBackIcon />} // <-- Add the icon here
      >
        Back
      </Button>
    </Link>
  );
};

export default memo(BackButton);

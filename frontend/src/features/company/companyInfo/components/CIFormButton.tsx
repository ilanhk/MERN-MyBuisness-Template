import Button, { ButtonProps } from '@mui/material/Button';
import '../css/companyInfoForms.css'

interface CIFormButtonProps {
  text: string;
  color: ButtonProps['color']; // Use the correct type for the color prop
  onClick?: () => void; // Optional onClick prop
  disabled?: boolean; 
}

const CIFormButton = ({ text, color, onClick }: CIFormButtonProps) => {
  return (
    <Button
      variant="contained"
      color={color} // Use color prop with the correct type
      size="medium"
      className="ci-form-button"
      type="submit"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default CIFormButton;

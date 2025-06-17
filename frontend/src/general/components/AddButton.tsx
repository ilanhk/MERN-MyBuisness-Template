import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import '../css/AddButton.css';


interface AddButtonProps {
  path: string;
}

const AddButton = ({ path }: AddButtonProps) => {
  const navigate = useNavigate();

  return (
    <button type="button" className="add-button" onClick={() => navigate(path)}>
      <AddBoxIcon sx={{ fontSize: '4rem' }}/>
    </button>
  );
};

export default memo(AddButton);


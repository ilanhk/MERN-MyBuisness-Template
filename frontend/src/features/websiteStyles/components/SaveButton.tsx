import { memo } from 'react';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import '../css/websiteStylesForms.css';

interface SaveButtonProps {
  onClick: () => void;
}

const SaveButton = ({ onClick }: SaveButtonProps) => {
  return (
    <button type="button" className="ws-save-button" onClick={onClick}>
      <SaveAltOutlinedIcon />
    </button>
  );
};

export default memo(SaveButton);

import { jsx as _jsx } from "react/jsx-runtime";
// import { memo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import '../css/AddButton.css';
// interface AddButtonProps {
//   path: string;
// }
// const AddButton = ({ path }: AddButtonProps) => {
//   const navigate = useNavigate();
//   return (
//     <button type="button" className="add-button" onClick={() => navigate(path)}>
//       <AddBoxIcon sx={{ fontSize: '4rem' }}/>
//     </button>
//   );
// };
// export default memo(AddButton);
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import '../css/AddButton.css';
const AddButton = ({ path }) => {
    const navigate = useNavigate();
    return (_jsx("button", { type: "button", className: "add-button", onClick: () => navigate(path), children: _jsx(AddBoxIcon, { sx: { fontSize: '2rem' } }) }));
};
export default memo(AddButton);

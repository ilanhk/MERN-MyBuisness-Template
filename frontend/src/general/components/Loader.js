import { jsx as _jsx } from "react/jsx-runtime";
import { OrbitProgress } from 'react-loading-indicators'; // from https://react-loading-indicators.netlify.app/
const Loader = ({ size = 'small' }) => {
    return _jsx(OrbitProgress, { color: "#52524f", size: size });
};
export default Loader;

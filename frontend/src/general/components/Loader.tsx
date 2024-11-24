import { OrbitProgress } from 'react-loading-indicators'; // from https://react-loading-indicators.netlify.app/

// Sizes - small, medium, large
type LoaderProps = {
  size?: 'small' | 'medium' | 'large';
};

const Loader = ({ size = 'small' }: LoaderProps) => {
  return <OrbitProgress color="#52524f" size={size} />;
};

export default Loader;

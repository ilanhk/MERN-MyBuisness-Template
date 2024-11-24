import { Outlet, Navigate } from "react-router-dom";
import { useSelectAuth } from "../../../features/auth/state/hooks";

const PrivateRoute = () => {
  const auth = useSelectAuth();

  return auth? <Outlet /> : <Navigate to='/login' replace />;
};
// replace -  to replace any past history

export default PrivateRoute;

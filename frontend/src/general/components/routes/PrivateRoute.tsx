import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const PrivateRoute = () => {
  const auth = useSelector((state: RootState) => state.authReducer.auth);

  return auth? <Outlet /> : <Navigate to='/login' replace />;
};
// replace -  to replace any past history

export default PrivateRoute;

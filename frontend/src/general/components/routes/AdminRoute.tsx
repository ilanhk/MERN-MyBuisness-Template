import { Outlet, Navigate } from "react-router-dom"; //Outlet is what we want to return if there is a user (will put out whatever page or screen we are trying to load)
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const AdminRoute = () => {
  const auth = useSelector((state: RootState) => state.authReducer.auth);

  return auth && auth.isEmployee ? <Outlet /> : <Navigate to='/login' replace />;
};
// replace -  to replace any past history

export default AdminRoute;

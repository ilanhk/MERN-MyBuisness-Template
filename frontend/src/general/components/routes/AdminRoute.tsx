import { Outlet, Navigate } from "react-router-dom"; //Outlet is what we want to return if there is a user (will put out whatever page or screen we are trying to load)
import { useSelectAuth } from "../../../features/auth/state/hooks";


const AdminRoute = () => {
  const auth = useSelectAuth();
  console.log('is Admin auth: ', auth)

  return auth && auth.isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};
// replace -  to replace any past history

export default AdminRoute;

import { Outlet, Navigate } from 'react-router-dom'; //Outlet is what we want to return if there is a user (will put out whatever page or screen we are trying to load)
import { useSelectAuth } from '../../../features/auth/state/hooks';
import EditingCompanySideBar from '../../../features/websiteStyles/components/EditingCompanySideBar';
import '../../css/companyEditingRoute.css';

const CompanyEditingRoute = () => {
  const auth = useSelectAuth();
  console.log('is Admin auth: ', auth);

  return auth && auth.isAdmin ? (
    <>
      <div className="c-editing-sidebar-with-outlet">
        <EditingCompanySideBar />
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default CompanyEditingRoute;

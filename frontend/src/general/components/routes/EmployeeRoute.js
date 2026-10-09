import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet, Navigate } from "react-router-dom"; //Outlet is what we want to return if there is a user (will put out whatever page or screen we are trying to load)
import { useSelectAuth } from "../../../features/auth/state/hooks";
const EmployeeRoute = () => {
    const auth = useSelectAuth();
    return auth && auth.isEmployee ? _jsx(Outlet, {}) : _jsx(Navigate, { to: '/login', replace: true });
};
// replace -  to replace any past history
export default EmployeeRoute;

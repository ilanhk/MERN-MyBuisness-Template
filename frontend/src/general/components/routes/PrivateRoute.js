import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet, Navigate } from "react-router-dom";
import { useSelectAuth } from "../../../features/auth/state/hooks";
const PrivateRoute = () => {
    const auth = useSelectAuth();
    return auth ? _jsx(Outlet, {}) : _jsx(Navigate, { to: '/login', replace: true });
};
// replace -  to replace any past history
export default PrivateRoute;

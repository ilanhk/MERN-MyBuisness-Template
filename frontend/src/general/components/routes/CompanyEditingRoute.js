import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, Navigate } from 'react-router-dom'; //Outlet is what we want to return if there is a user (will put out whatever page or screen we are trying to load)
import { useSelectAuth } from '../../../features/auth/state/hooks';
import EditingCompanySideBar from '../../../features/websiteStyles/components/EditingCompanySideBar';
import '../../css/companyEditingRoute.css';
const CompanyEditingRoute = () => {
    const auth = useSelectAuth();
    console.log('is Admin auth: ', auth);
    return auth && auth.isAdmin ? (_jsx(_Fragment, { children: _jsxs("div", { className: "c-editing-sidebar-with-outlet", children: [_jsx(EditingCompanySideBar, {}), _jsx(Outlet, {})] }) })) : (_jsx(Navigate, { to: "/login", replace: true }));
};
export default CompanyEditingRoute;

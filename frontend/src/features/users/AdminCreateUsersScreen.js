import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AddListOfUsersForm from "./components/AddListOfUsersForm";
import CreateUserForm from "./components/CreateUserForm";
import BackButton from "../../general/components/BackButton";
import "./css/AdminCreateUsersScreen.css";
const AdminCreateUsersScreen = () => {
    return (_jsxs("div", { className: "create-users-screen-container", children: [_jsx(BackButton, { route: '/admin/userlist' }), _jsx("h1", { children: "Admin Create User(s)" }), _jsx(AddListOfUsersForm, {}), _jsx("h2", { children: "Or" }), _jsx(CreateUserForm, {})] }));
};
export default AdminCreateUsersScreen;

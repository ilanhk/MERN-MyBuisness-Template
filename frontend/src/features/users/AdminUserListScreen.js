import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { useGetUsers, useSelectUsers, useDeleteUser } from './state/hooks';
import AddButton from '../../general/components/AddButton';
import AdminTable from '../../general/components/AdminTable';
const AdminUserListScreen = () => {
    const getUsersHook = useGetUsers();
    const deleteUserHook = useDeleteUser();
    const users = useSelectUsers();
    console.log('users', users);
    useEffect(() => {
        // const getAllUsers = async ()=> await getUsersHook();
        // getAllUsers();
        getUsersHook();
    }, [getUsersHook]);
    const [search, setSearch] = useState('');
    const filteredData = useMemo(() => users.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())), [users, search]);
    const columnList = [
        { name: 'Name', attribute: 'fullName' },
        { name: 'Email', attribute: 'email' },
        { name: 'Type', attribute: 'isEmployee' },
    ];
    return (_jsxs("div", { children: [_jsx("h2", { children: "User Admin Section" }), _jsxs("div", { className: "add-new-users", children: [_jsx("h4", { children: "Add a New User/list of users:" }), _jsx(AddButton, { path: '/admin/users/create' })] }), _jsxs("div", { children: [_jsx("input", { type: "text", placeholder: "Search users...", value: search, onChange: (e) => setSearch(e.target.value), style: { marginBottom: '10px', padding: '5px' } }), _jsx(AdminTable, { dataSet: filteredData, columns: columnList, route: '/admin/user', deleteHook: deleteUserHook })] })] }));
};
export default AdminUserListScreen;

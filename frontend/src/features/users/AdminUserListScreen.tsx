import { useState, useEffect, useMemo } from 'react';
import { useGetUsers, useSelectUsers, useDeleteUser } from './state/hooks';
import AddButton from '../../general/components/AddButton';
import AdminTable from '../../general/components/AdminTable';

const AdminUserListScreen = () => {
  const getUsersHook = useGetUsers();
  const deleteUserHook = useDeleteUser();
  const users = useSelectUsers();
  console.log('users', users)  
  
  useEffect(() => {
    // const getAllUsers = async ()=> await getUsersHook();
    // getAllUsers();
    getUsersHook();
  }, [getUsersHook]);

  

  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => 
    users.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    ), [users, search]
  );

  const columnList = [
    { name: 'Name', attribute: 'fullName' },
    { name: 'Email', attribute: 'email' },
    { name: 'Type', attribute: 'isEmployee' },
  ];

  return (
    <div>
      <h2>User Admin Section</h2>
      <div className="add-new-users">
        <h4>Add a New User/list of users:</h4>
        <AddButton path={'/admin/users/create'} />
      </div>
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <AdminTable dataSet={filteredData} columns={columnList} route='/admin/user' deleteHook={deleteUserHook}/>
      </div>
    </div>
  );
};


export default AdminUserListScreen;

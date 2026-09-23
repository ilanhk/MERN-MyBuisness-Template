import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUsersById, useSelectUsers } from './state/hooks';
import { UserState } from './state/slice';
import BackButton from '../../general/components/BackButton';
import './css/AdminViewScreen.css';



const AdminViewUserScreen = () => {
  const { id } = useParams<{ id: string }>();
  const getUserByIdHook = useGetUsersById();
  const users = useSelectUsers();

  const [user, setUser] = useState<Partial<UserState>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userData = users.find((u) => String(u._id) === String(id));

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getUserByIdHook(id)
        .catch((err) => setError(err?.message || 'Failed to fetch user'))
        .finally(() => setIsLoading(false));
    }
  }, [id, getUserByIdHook]);

  useEffect(() => {
    if (userData) {
      setUser(userData || {});
    }
  }, [userData]);

  const { firstName, lastName, email, isEmployee, isAdmin, inEmailList } = user;

  if (isLoading) {
    return <div className="view-container"><p>Loading user...</p></div>;
  }

  if (error) {
    return <div className="view-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="view-container">
      <BackButton route="/admin/userlist" />
      <h1 className='view-title'>User Information</h1>

      <div className="info-section">
        <label htmlFor="userIsEmployee">User Type:</label>
        <p>{isEmployee ? 'Employee' : 'Customer'}</p>
      </div>

      <div className="info-section">
        <label htmlFor="userFirstName">First Name:</label>
        <p>{firstName || '-'}</p>
      </div>

      <div className="info-section">
        <label htmlFor="userLastName">Last Name:</label>
        <p>{lastName || '-'}</p>
      </div>

      <div className="info-section">
        <label htmlFor="userEmail">Email:</label>
        <p>{email || '-'}</p>
      </div>

      {isAdmin && (
        <div className="info-section">
          <label htmlFor="userIsAdmin">Status:</label>
          <p>Admin</p>
        </div>
      )}

      {!isEmployee && (
        <div className="info-section">
          <label htmlFor="userInEmailList">Subscribed:</label>
          <p>{inEmailList ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default AdminViewUserScreen;

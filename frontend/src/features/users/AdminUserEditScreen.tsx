import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormMessage from '../../general/components/FormMessage';
import AuthFormButton from '../auth/components/AuthFormButton';
import BackButton from '../../general/components/BackButton';
import Loader from '../../general/components/Loader';
import { useGetUsersById, useUpdateUser, useSelectUsers } from './state/hooks';



const AdminUserEditScreen = () => {
  const { id } = useParams<{ id: string }>();
  const getUserByIdHook = useGetUsersById();
  const users = useSelectUsers();
  const updateUserHook = useUpdateUser();

  const user = users.find((u) => String(u._id) === String(id));


  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userIsEmployee, setUserIsEmployee] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [userInEmailList, setUserInEmailList] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      getUserByIdHook(id);
    }
  }, [id, getUserByIdHook]);

  useEffect(() => {
    if (user) {
      setUserFirstName(user.firstName || '');
      setUserLastName(user.lastName || '');
      setUserEmail(user.email || '');
      setUserIsEmployee(user.isEmployee || false);
      setUserIsAdmin(user.isAdmin || false);
      setUserInEmailList(user.inEmailList || false);
    }
  }, [user]);

  const handleIsAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserIsAdmin(e.target.checked);
  };

  const handleInEmailListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInEmailList(e.target.checked);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSuccess(false);
    setIsLoading(true);

    const updatedData = {
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
      isEmployee: userIsEmployee,
      isAdmin: userIsAdmin,
      inEmailList: userInEmailList,
    };

    try {
      const updatedUser = await updateUserHook(id, updatedData);
      console.log('User updated:', updatedUser);
      setIsSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update user. Please try again.';
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="form-container">
      <BackButton route='/admin/userlist'/>
      <h2 className="form-title">Update User</h2>
      <form className="form-form" onSubmit={submitHandler} noValidate>
        <div className="form-input">
          <label htmlFor="userFirstName">First Name:</label>
          <input
            id="userFirstName"
            type="text"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="userLastName">Last Name:</label>
          <input
            id="userLastName"
            type="text"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="userEmail">Email:</label>
          <input
            id="userEmail"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="userType">Type of User:</label>
          <RadioGroup
            row
            name="userType"
            value={userIsEmployee ? 'employee' : 'customer'}
            onChange={(e) => setUserIsEmployee(e.target.value === 'employee')}
          >
            <FormControlLabel value="customer" control={<Radio />} label="Customer" />
            <FormControlLabel value="employee" control={<Radio />} label="Employee" />
          </RadioGroup>
        </div>

        <div className="form-input">
          <label htmlFor="userIsAdmin">Is Admin:</label>
          <Switch
            id="userIsAdmin"
            checked={userIsAdmin}
            onChange={handleIsAdminChange}
          />
        </div>

        <div className="form-input">
          <label htmlFor="userInEmailList">In Email List:</label>
          <Switch
            id="userInEmailList"
            checked={userInEmailList}
            onChange={handleInEmailListChange}
          />
        </div>

        <AuthFormButton type="submit" text="Update" />
        
        {error  && (
          <div className="form-message-wrapper">
            <FormMessage message={error} level="error"/>
          </div>
        )}
        {isSuccess && (
          <div className="form-message-wrapper">
            <FormMessage message="User Updated!" level="success"/>
          </div>
        )}
        { isLoading && (
          <div className="form-message-wrapper">
            <Loader size="small" />
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminUserEditScreen;

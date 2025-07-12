import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import AuthFormButton from '../../auth/components/AuthFormButton';
import { useCreateUser } from '../state/hooks';

const CreateUserForm = () => {
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userIsEmployee, setUserIsEmployee] = useState(false);
  const [userInEmailList, setUserInEmailList] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const createUserHook = useCreateUser();

  const handleInEmailList = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInEmailList(e.target.checked);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userFirstName || !userLastName || !userEmail || !userPassword) {
      setError('First name, last name, email, and password are required.');
      return;
    }

    const fullName = `${userFirstName} ${userLastName}`.trim();

    try {
      const newUser = await createUserHook(
        userFirstName,
        userLastName,
        fullName,
        userEmail,
        userInEmailList,
        userPassword,
        userIsEmployee
      );

      console.log('User added:', newUser);
      navigate('/admin/userlist');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || // Axios-style error
        err?.message || // JS Error
        'Failed to create user. Please try again.';

      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create a New User</h2>
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
          <label htmlFor="userPassword">Password:</label>
          <input
            id="userPassword"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
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
            <FormControlLabel
              value="customer"
              control={<Radio />}
              label="Customer"
            />
            <FormControlLabel
              value="employee"
              control={<Radio />}
              label="Employee"
            />
          </RadioGroup>
        </div>

        <div className="form-input">
          <label htmlFor="userInEmailList">In Email List:</label>
          <Switch
            id="userInEmailList"
            checked={userInEmailList}
            onChange={handleInEmailList}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <AuthFormButton text="Create" />
      </form>
    </div>
  );
};

export default CreateUserForm;

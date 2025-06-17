import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import AuthFormButton from '../../auth/components/AuthFormButton';

import { useSelectAuth, useRegister } from '../../auth/state/hooks';

const CreateUserForm = () => {
  const auth = useSelectAuth();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const inEmailListRef = useRef<HTMLInputElement>(null);

  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const [userConfirmPassword, setUserConfirmPassword] = useState<string | null>(
    null
  );
  const [userIsEmployee, setUserIsEmployee] = useState<string | null>(null);
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [userInEmailList, setUserInEmailList] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const registerHook = useRegister();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullName = `${userFirstName} ${userLastName}`;

    if (
      !userFirstName ||
      !userLastName ||
      !userEmail ||
      !userPassword ||
      !userConfirmPassword ||
      !userIsEmployee
    ) {
      setError('All fields are required.');
      return;
    }

    if (userPassword !== userConfirmPassword) {
      setError('passwords dont match');
      return;
    }

    await registerHook(
      firstName,
      lastName,
      fullName,
      email,
      inEmailList,
      password
    );

    navigate('/');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create a New User</h2>
      <form className="form-form" onSubmit={submitHandler} noValidate>
        <div className="form-input">
          <label htmlFor="firstName">First Name: </label>
          <input ref={firstNameRef} id="firstName" type="text" required />
        </div>

        <div className="form-input">
          <label htmlFor="lastName">Last Name: </label>
          <input ref={lastNameRef} id="lastName" type="text" required />
        </div>

        <div className="form-input">
          <label htmlFor="email">Email: </label>
          <input ref={emailRef} id="email" type="email" required />
        </div>

        <div className="form-input">
          <label htmlFor="password">Password: </label>
          <input ref={passwordRef} id="password" type="password" required />
        </div>

        <div className="form-input">
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            ref={confirmPasswordRef}
            id="confirmPassword"
            type="password"
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="ecommerce" className="label">
            Type of User:
          </label>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Customer"
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="Employee"
            />
            <FormControlLabel
              value="other"
              control={<Radio />}
              label="Affiliate "
            />
          </RadioGroup>
        </div>

        <div className="ci-form-input">
          <label htmlFor="ecommerce" className="ci-label">
            Admin:
          </label>
          <p>if no the user wont have admin status</p>
          <Switch checked={userIsAdmin} onChange={handleEcommerceChange} />
        </div>

        <div className="form-checkbox">
          <input type="checkbox" id="acknowlegde" ref={inEmailListRef} />
          <label htmlFor="inEmailList">Subscribe user to newsletter</label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <AuthFormButton text="Register" />
      </form>
    </div>
  );
};

export default CreateUserForm;

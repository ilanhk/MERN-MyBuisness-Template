import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IndDB } from '../../general/utils/indexedDB';
import AuthFormButton from './components/AuthFormButton';
import GoogleAuthButton from './components/GoogleAuthButton';
import { useSelectAuth, useRegister } from './state/hooks';
import './css/forms.css';



const RegisterScreen = () => {
  const auth = useSelectAuth();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const inEmailListRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null);


  const indexedDB = IndDB.instance;
  const navigate = useNavigate();
  const registerHook = useRegister();

  useEffect(()=>{
    if(auth?.refreshToken){
      indexedDB.saveDataToDB("token", auth.refreshToken);
      console.log(indexedDB, auth)
    };
  },[auth, indexedDB]);

  

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    // Register user
    e.preventDefault();

     const firstName = firstNameRef.current?.value;
     const lastName = lastNameRef.current?.value;
     const fullName = `${firstName} ${lastName}`;
     const email = emailRef.current?.value;
     const password = passwordRef.current?.value;
     const confirmPassword = confirmPasswordRef.current?.value;
     const inEmailList = inEmailListRef.current?.checked || false; 

     if ( !firstName || !lastName|| !email || !password || !confirmPassword || !inEmailList) {
      setError("All fields are required.");
      return;
    };

    if ( password !== confirmPassword) {
      setError("passwords dont match");
      return;
    };

    await registerHook( 
      firstName,
      lastName,
      fullName,
      email,
      password,
      inEmailList
    );

    // indexedDB.saveDataToDB("token", auth.refreshToken);
    navigate('/');

  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Sign In</h2>
      <form className='form-form' onSubmit={submitHandler} noValidate>
        <div className='form-input'>
          <label htmlFor="firstName">First Name: </label>
          <input ref={firstNameRef} id="firstName" type="text" required />
        </div>

        <div className='form-input'>
          <label htmlFor="lastName">Last Name: </label>
          <input ref={lastNameRef} id="lastName" type="text" required />
        </div>

        <div className='form-input'>
          <label htmlFor="email">Email: </label>
          <input ref={emailRef} id="email" type="email" required />
        </div>

        <div className='form-input'>
          <label htmlFor="password">Password: </label>
          <input ref={passwordRef} id="password" type="password" required />
        </div>

        <div className='form-input'>
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            ref={confirmPasswordRef}
            id="confirmPassword"
            type="password"
            required
          />
        </div>

        <div className='form-checkbox'>
          <input 
            type="checkbox" 
            id="acknowlegde" 
            ref={inEmailListRef}   
            required
            />
          <label htmlFor="inEmailList">Subscribe to MyBusiness newsletter</label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <AuthFormButton text="Register" />

        <h3>OR</h3>

        <GoogleAuthButton />
      </form>
      
      
      <p>
        Have an account? <Link to="/login">Login</Link>
      </p>

      
    </div>
  );
};

export default RegisterScreen;

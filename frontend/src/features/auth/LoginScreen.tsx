import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { IndDB } from '../../general/utils/indexedDB'
import { useLogin, useSelectAuth } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";

const LoginScreen = () => {
  const auth = useSelectAuth();
  
  const emailRef = useRef<HTMLInputElement>(null); // get reference from to an html element expecially its value
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const indexedDB = IndDB.instance;
  const navigate = useNavigate();
  const loginHook = useLogin();

  useEffect(()=>{
    if(auth?.refreshToken){
      indexedDB.saveDataToDB("token", auth.refreshToken);
      console.log(indexedDB, auth);
    };
  },[auth, indexedDB]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

     const email = emailRef.current?.value;
     const password = passwordRef.current?.value;

     if (!email || !password) {
      setError("Both fields are required.");
      return;
    };

    await loginHook(email, password);
    console.log('auth: ', auth);
    navigate('/');
 
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Login</h2>
      <form className='form-form' onSubmit={submitHandler} noValidate>
          <div className='form-input'>
            <label htmlFor="email">Email: </label>
            <input ref={emailRef} id="email" type="email" required  defaultValue={'charlie.c@example.com'}/>
          </div>

          <div className='form-input'>
            <label htmlFor="password">Password: </label>
            <input ref={passwordRef} id="password" type="password" required  defaultValue={'Charliechaplain123456789!'}/>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <AuthFormButton text="Continue"/> 
      </form>
      <p>
        Forgot <Link to='/forgot-password'>username or password?</Link>
      </p>
      <p>
        New to MyBusiness? <Link to='/register'>Register a new account</Link> 
      </p>
      
    </div>
  )
};

export default LoginScreen;
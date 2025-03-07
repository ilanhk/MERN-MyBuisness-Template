import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { IndDB } from '../../general/utils/indexedDB'
import { useLogin, useSelectAuth } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";
import GoogleAuthButton from "./components/GoogleAuthButton";


const LoginScreen = () => {
  const auth = useSelectAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<HTMLInputElement>(null); // get reference from to an html element expecially its value
  const passwordRef = useRef<HTMLInputElement>(null);
  const twoFARef = useRef<HTMLInputElement>(null);
  const [twoFARequired, setTwoFARequired] = useState(false);
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

     const emailR = emailRef.current?.value + '';
     const passwordR = passwordRef.current?.value + '';
    setEmail(emailR);
    setPassword(passwordR)
     const twoFACode = twoFARef.current?.value;

     if (!email || !password) {
      setError("Both fields are required.");
      return;
    };

    try {
      let response;
      if(twoFARequired){
        if(!twoFACode){
          setError("2FA code required.");
        };

        response = await loginHook(email, password, twoFACode);
      } else{
        response = await loginHook(email, password);
      };
      
      if (response.meta.requestStatus === "fulfilled") {
        navigate('/'); // Navigate to the main page
      } else {
        setTwoFARequired(true);
        setError(null);
      }
    } catch (err: any) {
      // Catch specific error based on error message or code
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message; // Adjust based on actual error structure
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    }
 
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Login</h2>
      <form className='form-form' onSubmit={submitHandler} noValidate>
        { twoFARequired ? (
          <div className='form-input'>
          <label htmlFor="twoFA">2FA Code: </label>
          <input ref={twoFARef} id="twoFA" type="password" required  />
        </div>
        ) : (
          <>
            <div className='form-input'>
            <label htmlFor="email">Email: </label>
            <input ref={emailRef} id="email" type="email" required  defaultValue={'charlie.c@example.com'}/>
          </div>

          <div className='form-input'>
            <label htmlFor="password">Password: </label>
            <input ref={passwordRef} id="password" type="password" required  defaultValue={'Charliechaplain123456789!'}/>
          </div>

          </>
        )}
          

          {error && <p style={{ color: "red" }}>{error}</p>}

          <AuthFormButton text="Continue"/>
          
          <h3>OR</h3>

          <GoogleAuthButton /> 
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
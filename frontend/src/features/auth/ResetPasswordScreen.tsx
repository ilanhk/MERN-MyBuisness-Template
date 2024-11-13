import { useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useResetPassword } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";

const ResetPasswordScreen = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const resetPasswordHook = useResetPassword();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

     if(!password || !confirmPassword){
      setError("New Password and confirmed password is required.");
     };

     if ( password !== confirmPassword) {
      setError("passwords dont match");
      return;
    };

     try {
      const response = await resetPasswordHook(password);

      // if (response.meta.requestStatus === "fulfilled") {
      //   navigate('/'); // Navigate to the main page
      // } else {
      //   setTwoFARequired(true);
      //   setError(null);
      // }
      
     } catch (error) {
      console.log(error);
     };
     
 
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Forgot Password</h2>
      <form className='form-form' onSubmit={submitHandler} noValidate>
        
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

export default ResetPasswordScreen;


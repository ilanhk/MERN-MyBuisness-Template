import { useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPassword } from "./state/hooks";
import AuthFormButton from "./components/AuthFormButton";

const ForgotPasswordScreen = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const forgotPasswordHook = useForgotPassword();


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

     const email = emailRef.current?.value + '';

     if(!email){
      setError("Email is required.");
     };

    

     try {
      const response = await forgotPasswordHook(email);
      console.log(email)

      if (response.meta.requestStatus === "fulfilled") {
        console.log('reset email sent!')
      } else {
        console.log(response)
      }
      
     } catch (error) {
      console.log(error);
     };
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Forgot Password</h2>
      <form className='form-form' onSubmit={submitHandler} noValidate>
        
      <div className='form-input'>
            <label htmlFor="email">Email: </label>
            <input ref={emailRef} id="email" type="email" required  defaultValue={'ilanlieberman@hotmail.com'}/>
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

export default ForgotPasswordScreen;
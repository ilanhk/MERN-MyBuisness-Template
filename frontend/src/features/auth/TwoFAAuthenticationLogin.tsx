import { useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelectAuth } from "./state/hooks";
import { verify2fa } from "../../general/utils/2faApis";
import AuthFormButton from "./components/AuthFormButton";


const TwoFAAuthenticationLogin = () => {
  const auth = useSelectAuth();
  const twoFACodeRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const twoFACode = twoFACodeRef.current?.value;

    if (!twoFACode) {
      setError("Require 2FA code.");
      return;
    }

    try {
      await verify2fa({ token: twoFACode, secret: auth.twoFaSecret! });
      navigate('/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Login</h2>
      <form className='form-form' onSubmit={submitHandler} noValidate>
        <div className='form-input'>
          <label htmlFor="twoFACodeRef">2FA Code: </label>
          <input ref={twoFACodeRef} id="twoFACodeRef" type="text" required defaultValue={'Charliechaplain123456789!'}/>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <AuthFormButton text="Continue"/> 
      </form>
      <p>
        Need to reset 2FA code? <Link to='/register'>Reset here.</Link> 
      </p>
    </div>
  );
};

export default TwoFAAuthenticationLogin;
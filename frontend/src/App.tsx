import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // outlet for the react router
import { ToastContainer } from 'react-toastify';
import { IndDB } from "./general/utils/indexedDB";
import { useRefresh, useLogout } from "./features/auth/state/hooks";
import Header from "./general/components/Header";
import Footer from "./general/components/Footer";
import './App.css'



function App() {
  const indexedDB = IndDB.instance;
  const navigate = useNavigate();
  const refreshHook = useRefresh();
  const logoutHook = useLogout();

  useEffect(()=>{
    const getRefreshTokenAndLogin = async ()=>{
      const data = await refreshHook();
      const { refreshToken } = data.payload;
      if(refreshToken){
        console.log('data from refreshHook: ', refreshToken);
        await indexedDB.saveDataToDB('token', refreshToken);
      }else{
        await logoutHook();
        await indexedDB.saveDataToDB('token', null);
      };
      navigate('/')
    };

    getRefreshTokenAndLogin()

  },[refreshHook, logoutHook, navigate]);

  return (
    <>
      <Header/>
      <Outlet />
      <Footer/>

      <ToastContainer />
    </>
  )
}

export default App

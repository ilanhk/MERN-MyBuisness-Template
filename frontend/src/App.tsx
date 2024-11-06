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
      console.log('data from refresh: ', data);
      if(data.payload){
        const { refreshToken } = data.payload;
        await indexedDB.saveDataToDB('token', refreshToken);
      }else{
        await indexedDB.saveDataToDB('token', null);
        await logoutHook();
      };
      navigate('/')
    };

    getRefreshTokenAndLogin()

  },[ refreshHook, logoutHook, navigate]);

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

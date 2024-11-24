import { useEffect } from "react";
import { Outlet } from "react-router-dom"; // outlet for the react router
import { ToastContainer } from 'react-toastify';
import { IndDB } from "./general/utils/indexedDB";
import { useRefresh, useLogout } from "./features/auth/state/hooks";
import { useGetCompanyInfo } from "./features/company/companyInfo/state/hooks";
import Header from "./general/components/Header";
import Footer from "./general/components/Footer";
import './App.css'



function App() {
  const indexedDB = IndDB.instance;
  const refreshHook = useRefresh();
  const logoutHook = useLogout();
  const getCompanyInfoHook = useGetCompanyInfo();
  

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
    };

    const getCompanyInfo = async()=>{
      const companyInfo = await getCompanyInfoHook();
      console.log(companyInfo.payload)
    };

    getRefreshTokenAndLogin();
    getCompanyInfo();
   

  },[ refreshHook, logoutHook, getCompanyInfoHook]);

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

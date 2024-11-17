import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // outlet for the react router
import { ToastContainer } from 'react-toastify';
import { IndDB } from "./general/utils/indexedDB";
import { useRefresh, useLogout } from "./features/auth/state/hooks";
import { useSelectCompanyInfo, useCreateCompanyInfo } from "./features/company/companyInfo/state/hooks";
import Header from "./general/components/Header";
import Footer from "./general/components/Footer";
import './App.css'



function App() {
  const indexedDB = IndDB.instance;
  const navigate = useNavigate();
  const refreshHook = useRefresh();
  const logoutHook = useLogout();
  const companyInfo = useSelectCompanyInfo();
  const createCompanyInfoHook = useCreateCompanyInfo();

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
      // navigate('/');
    };

    const getOrCreateCompanyInfo = async()=>{
      if(!companyInfo.home){
        const companyData = await createCompanyInfoHook();
        console.log('company data', companyData)
        return companyData.payload;
      } else{
        return;
      }
    };

    getRefreshTokenAndLogin()
    getOrCreateCompanyInfo()

  },[ refreshHook, logoutHook, navigate, createCompanyInfoHook, companyInfo.home]);

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

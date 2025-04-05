import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';  // ✅ Move GoogleOAuthProvider here
import store from './app/store';

import App from './App';
import AdminRoute from './general/components/routes/AdminRoute';
import CompanyEditingRoute from './general/components/routes/CompanyEditingRoute';
import PrivateRoute from './general/components/routes/PrivateRoute';


import HomeScreen from './general/screens/HomeScreen';
import LoginScreen from './features/auth/LoginScreen';
import RegisterScreen from './features/auth/RegisterScreen';
import ProductsScreen from './features/products/ProductsScreen';
import ProductScreen from './features/products/ProductScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import ForgotPasswordScreen from './features/auth/ForgotPasswordScreen';
import AdminScreen from './features/company/AdminScreen';
import AdminProductPageScreen from './features/products/AdminProductPageScreen';
import AdminProductEditScreen from './features/products/AdminProductEditScreen';
import AdminUserListScreen from './features/users/AdminUserListScreen';
import AdminUserEditScreen from './features/users/AdminUserEditScreen';
import AdminJobsLists from './features/company/jobs/AdminJobsLists';
import AdminEditJob from './features/company/jobs/AdminEditJob';
import AdminEditCompanyInfo from "./features/company/companyInfo/edit-pages-screens/AdminEditCompanyInfo";
import AdminEditWebsiteStyles from "./features/websiteStyles/AdminEditWebsiteStyles";
import AdminEditHomePage from "./features/company/companyInfo/edit-pages-screens/AdminEditHomePage";
import AdminEditAboutUs from "./features/company/companyInfo/edit-pages-screens/AdminEditAboutUs";
import AdminEditServices from "./features/company/companyInfo/edit-pages-screens/AdminEditServices";
import AdminEditContactUs from "./features/company/companyInfo/edit-pages-screens/AdminEditContactUs";
import AboutUsScreen from './features/company/AboutUsScreen';
import ServicesScreen from './features/company/ServicesScreen';
import CareersScreen from './features/company/jobs/CareersScreen';
import ContactUsScreen from './features/company/ContactUsScreen';
import './App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product" element={<ProductsScreen />} />
      <Route path="/product/:pageNumber" element={<ProductsScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/about" element={<AboutUsScreen />} />
      <Route path="/service" element={<ServicesScreen />} />
      <Route path="/job" element={<CareersScreen />} />
      <Route path="/contact" element={<ContactUsScreen />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password/:id" element={<ForgotPasswordScreen />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/admin/productlist" element={<AdminProductPageScreen />} />
        <Route path="/admin/productlist/:pageNumber" element={<AdminProductPageScreen />} />
        <Route path="/admin/product/:id/edit" element={<AdminProductEditScreen />} />
        <Route path="/admin/userlist" element={<AdminUserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<AdminUserEditScreen />} />
        <Route path="/admin/joblist" element={<AdminJobsLists />} />
        <Route path="/admin/job/:id/edit" element={<AdminEditJob />} />
      </Route>

      <Route path="" element={<CompanyEditingRoute />}>
        <Route path="/admin/edit/homepage" element={<AdminEditHomePage />} />
        <Route path="/admin/edit/company-info" element={<AdminEditCompanyInfo />} />
        <Route path="/admin/edit/website-styles" element={<AdminEditWebsiteStyles />} />
        <Route path="/admin/edit/aboutpage" element={<AdminEditAboutUs />} />
        <Route path="/admin/edit/services" element={<AdminEditServices />} />
        <Route path="/admin/edit/contactpage" element={<AdminEditContactUs />} />
        
      </Route>
    </Route>
  )
);

console.log('google cli id: ' , GOOGLE_CLIENT_ID)

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </GoogleOAuthProvider>
);

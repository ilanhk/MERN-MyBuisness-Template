import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'; // for all react routes
import { Provider } from 'react-redux'
import store from './app/store.ts'
import App from './App.tsx'

import AdminRoute from './general/components/routes/AdminRoute.tsx';
import PrivateRoute from './general/components/routes/PrivateRoute.tsx';
import HomeScreen from './general/screens/HomeScreen.tsx';
import LoginScreen from './features/auth/LoginScreen.tsx';
import RegisterScreen from './features/auth/RegisterScreen.tsx';
import ProductsScreen from './features/products/ProductsScreen.tsx';
import ProductScreen from './features/products/ProductScreen.tsx';
import ProfileScreen from './features/profile/ProfileScreen.tsx';
import ForgotPasswordScreen from './features/auth/ForgotPasswordScreen.tsx';
import AdminScreen from './features/company/AdminScreen.tsx';
import AdminProductPageScreen from './features/products/AdminProductPageScreen.tsx';
import AdminProductEditScreen from './features/products/AdminProductEditScreen.tsx';
import AdminUserListScreen from './features/users/AdminUserListScreen.tsx';
import AdminUserEditScreen from './features/users/AdminUserEditScreen.tsx';
import AdminJobsLists from './features/company/jobs/AdminJobsLists.tsx';
import AdminEditJob from './features/company/jobs/AdminEditJob.tsx';
import AdminEditPagesScreen from './features/company/AdminEditPagesScreen.tsx';
import AboutUsScreen from './features/company/AboutUsScreen.tsx';
import ServicesScreen from './features/company/ServicesScreen.tsx';
import CareersScreen from './features/company/jobs/CareersScreen.tsx';
import ContactUsScreen from './features/company/ContactUsScreen.tsx';
import TwoFAAuthenticationLogin from './features/auth/TwoFAAuthenticationLogin.tsx';
import './App.css';

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
      
      <Route path='' element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/twofactorauthention" element={<TwoFAAuthenticationLogin />}/>
      </Route>

      <Route path='' element={<AdminRoute />}>
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/admin/productlist" element={<AdminProductPageScreen />} />
          <Route path="/admin/productlist/:pageNumber" element={<AdminProductPageScreen />} />
          <Route path="/admin/product/:id/edit" element={<AdminProductEditScreen />} />
          <Route path="/admin/userlist" element={<AdminUserListScreen />} />
          <Route path="/admin/user/:id/edit" element={<AdminUserEditScreen />} />
          <Route path="/admin/joblist" element={<AdminJobsLists />} />
          <Route path="/admin/job/:id/edit" element={<AdminEditJob />} />
          <Route path="/admin/editpages" element={<AdminEditPagesScreen />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

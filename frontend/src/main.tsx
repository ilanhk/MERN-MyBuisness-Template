import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

import AdminRoute from './general/components/routes/AdminRoute';
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
import AdminEditPagesScreen from './features/company/AdminEditPagesScreen';
import AboutUsScreen from './features/company/AboutUsScreen';
import ServicesScreen from './features/company/ServicesScreen';
import CareersScreen from './features/company/jobs/CareersScreen';
import ContactUsScreen from './features/company/ContactUsScreen';
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
        <Route path="/admin/editpages" element={<AdminEditPagesScreen />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

import { Link } from 'react-router-dom';
import '../css/EditingCompanySideBar.css';

const EditingCompanySideBar = () => {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">Edit Settings</h2>
      <nav className="sidebar">
        <ul>
          <li>
            <Link to="/admin/edit/company-info">Company Information</Link>
          </li>
          <li>
            <Link to="/admin/edit/website-styles">Website Styling</Link>
          </li>
          <li>
            <Link to="/admin/edit/homepage">Home Page</Link>
          </li>
          <li>
            <Link to="/admin/edit/aboutpage">About us Page</Link>
          </li>
          <li>
            <Link to="/admin/edit/services">Services Page</Link>
          </li>
          <li>
            <Link to="/admin/edit/contactpage">Contact us Page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EditingCompanySideBar;

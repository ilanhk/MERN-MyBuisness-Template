import AddListOfUsersForm from "./components/AddListOfUsersForm";
import CreateUserForm from "./components/CreateUserForm";
import "./css/AdminCreateUsersScreen.css";


const AdminCreateUsersScreen = () => {
  return (
    <div className="create-users-screen-container">
      <h2>Admin Create User(s)</h2>
      <AddListOfUsersForm />

      <h4>Or</h4>

      <CreateUserForm />

    </div>
  )
}

export default AdminCreateUsersScreen;
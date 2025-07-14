import AddListOfUsersForm from "./components/AddListOfUsersForm";
import CreateUserForm from "./components/CreateUserForm";
import BackButton from "../../general/components/BackButton";
import "./css/AdminCreateUsersScreen.css";


const AdminCreateUsersScreen = () => {
  return (
    <div className="create-users-screen-container">
      <BackButton route='/admin/userlist' />
      <h1>Admin Create User(s)</h1>
      <AddListOfUsersForm />

      <h2>Or</h2>

      <CreateUserForm />

    </div>
  )
}

export default AdminCreateUsersScreen;
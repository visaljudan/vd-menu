import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import BusinessManagement from "./pages/client/BusinessManagement";
import CategoryManagement from "./pages/client/CategoryManagement";
import SignInPage from "./pages/auth/SignInPage";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminUserEdit from "./pages/admin/AdminUserEdit";
import CartPage from "./pages/customer/CartPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ItemManagementPage from "./pages/client/ItemManagementPage";
import AdminDashboard from "./components/AdminDashboard"
const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* General  */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/Signin" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/card-page" element={<CartPage />} />

          {/* Client */}
          <Route
            path="/client/category-management"
            element={<CategoryManagement />}
          />
          <Route path="client/item-management" element={<ItemManagementPage/>} />
          {/* Admin */}
          <Route path="/business-management" element={<BusinessManagement />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="/admin/user-management"
            element={<AdminUserManagement />}
          />
          <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/users/:id" element={<AdminUserEdit />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

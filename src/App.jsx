import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage"
import ForgotPassword  from "./pages/auth/ForgotPassword";
import BusinessManagement from "./pages/client/BusinessManagement"
import CategoryManagement from "./pages/client/CategoryManagement";
import UerManagement from "./pages/client/UserManagement"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword/>} />
        <Route path="/businessmanagement" element={<BusinessManagement/>} />
        <Route path="/categorymanagement" element={<CategoryManagement/>} />
        <Route path="/uermanagement" element={<UerManagement/>} />

        
      </Routes>
    </Router>
  );
};

export default App;

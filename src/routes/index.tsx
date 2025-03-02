import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Activate from "../pages/auth/Activate";
import CompleteSignup from "../pages/auth/CompleteSignup";
import ResetPassword from "../pages/auth/ResetPassword";
import ResetConfirm from "../pages/auth/ResetConfirm";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "../pages/auth/ChangePassword";
import VdotTraining from "../pages/vdot/VdotTraining";
import VdotFormula from "../pages/vdot/VdotFormula";
import VdotEquivalent from "../pages/vdot/VdotEquivalent";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/:uid/:token" element={<Activate />} />
        <Route path="/complete-signup" element={<CompleteSignup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetConfirm />} />
        <Route element={<ProtectedRoute />}>
          {/* ログイン後のページ */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/vdot-training" element={<VdotTraining />} />
          <Route path="/vdot-formula" element={<VdotFormula />} />
          <Route path="/vdot-equivalent" element={<VdotEquivalent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

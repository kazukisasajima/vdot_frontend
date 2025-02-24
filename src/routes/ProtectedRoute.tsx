import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuthToken } from "../features/authSlice";
import { RootState, AppDispatch } from "../store";

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(verifyAuthToken()).unwrap();
      } catch (error) {
        console.error("🔴 認証エラー", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return <div>🔄 認証確認中...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

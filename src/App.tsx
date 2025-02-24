import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { verifyAuthToken } from "./features/authSlice";
import AppRoutes from "./routes";
import './index.css';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log("✅ ページロード時に `verifyAuthToken` を実行");
    dispatch(verifyAuthToken());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;

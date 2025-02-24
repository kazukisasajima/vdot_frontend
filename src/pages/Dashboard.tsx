import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { loadUser } from "../features/authSlice";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as { name: string } | null;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6">ダッシュボード</h2>
        <p className="text-lg text-gray-700">
          ようこそ、<strong>{user?.name}</strong> さん！
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

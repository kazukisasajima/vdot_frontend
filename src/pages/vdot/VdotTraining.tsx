import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadUser } from "../../features/authSlice";
import VdotTabs from '../../components/vdot/VdotTabs';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const VdotTraining = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as { id: number ,name: string } | null;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	console.log(user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

	const [loading, setLoading] = useState(true);

// user のデータ取得後に処理
useEffect(() => {
  if (user) {
    setLoading(false); // user 取得完了後にローディング終了
  }
}, [user]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <VdotTabs />
      <div>
        <h1 className="text-4xl mb-4">VDOTトレーニング</h1>
        <div className="flex flex-col items-center justify-center h-screen">
            
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VdotTraining
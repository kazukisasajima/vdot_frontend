import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadUser } from "../../features/authSlice";
import VdotTabs from '../../components/vdot/VdotTabs';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const VdotEquivalent = () => {
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
      <VdotTabs/>
        <div>同等</div>
      <Footer />
    </div>
  )
}

export default VdotEquivalent
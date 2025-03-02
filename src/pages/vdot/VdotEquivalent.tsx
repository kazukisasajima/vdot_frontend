import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadUser } from "../../features/authSlice";
import VdotTabs from '../../components/vdot/VdotTabs';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const VdotEquivalent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as { id: number, name: string } | null;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  const [loading, setLoading] = useState(true);
  const [racePredictions, setRacePredictions] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchUserVdot = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:8000/api/get_user_vdot/${user.id}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
        });

        const data = await response.json();
        console.log("data", data);
        setRacePredictions(data.race_times);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserVdot();
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
      <VdotTabs/>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-4">VDOTによるレース予想</h1>
        <div className="flex flex-col items-center justify-center h-screen">
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">レース</th>
                <th className="border border-gray-400 px-4 py-2">時間</th>
                <th className="border border-gray-400 px-4 py-2">ペース</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(racePredictions).map((distance) => (
                <tr key={distance}>
                  <td className="border border-gray-400 px-4 py-2">{distance}</td>
                  <td className="border border-gray-400 px-4 py-2">{racePredictions[distance]?.predictTime ?? "-"}</td>
                  <td className="border border-gray-400 px-4 py-2">{racePredictions[distance]?.pacePerKm ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VdotEquivalent;

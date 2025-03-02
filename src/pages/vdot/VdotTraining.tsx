import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadUser } from "../../features/authSlice";
import VdotTabs from '../../components/vdot/VdotTabs';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const VdotTraining = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as { id: number, name: string } | null;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  const [loading, setLoading] = useState(true);
  const [paceZones, setPaceZones] = useState<Record<string, any>>({});

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
        console.log("pace_zones", data.pace_zones);
        setPaceZones(data.pace_zones);
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

  // ゾーンキー（E, M, T, I, R）を取得
  const zoneKeys = Object.keys(paceZones);

  // 距離キー（1mi, 1200m, ...）を取得（Eペースのデータを基準にする）
  const distanceKeys = zoneKeys.length > 0 ? Object.keys(paceZones["E"] ?? {}) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <VdotTabs />
      <div>
        <h1 className="text-4xl mb-4">VDOTトレーニング</h1>
        <div className="flex flex-col items-center justify-center h-screen">
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">タイプ</th>
                {distanceKeys.map((distance) => (
                  <th key={distance} className="border border-gray-400 px-4 py-2">{distance}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zoneKeys.map((zone) => (
                <tr key={zone}>
                  <td className="border border-gray-400 px-4 py-2">{zone}</td>
                  {distanceKeys.map((distance) => {
                    const paceData = paceZones[zone]?.[distance];

                    return (
                      <td key={`${zone}-${distance}`} className="border border-gray-400 px-4 py-2">
                        {paceData
                          ? zone === "E"
                            ? `${paceData.lower_pace} ~ ${paceData.upper_pace}` // Eの場合はlower_pace ~ upper_pace
                            : `${paceData.lower_pace}` // E以外はlower_paceのみ
                          : "-"}
                      </td>
                    );
                  })}
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

export default VdotTraining;

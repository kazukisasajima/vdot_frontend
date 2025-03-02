import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadUser } from "../../features/authSlice";
import VdotTabs from '../../components/vdot/VdotTabs';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


const DISTANCES = [
  { label: "マラソン", value: 42.195, unit: "km" },
  { label: "ハーフマラソン", value: 21.0975, unit: "km" },
  { label: "10マイル", value: 16.0934, unit: "mile" },
  { label: "15km", value: 15, unit: "km" },
  { label: "10km", value: 10, unit: "km" },
  { label: "8km", value: 8, unit: "km" },
  { label: "6km", value: 6, unit: "km" },
  { label: "5km", value: 5, unit: "km" },
  { label: "2マイル", value: 3.21869, unit: "mile" },
  { label: "3200m", value: 3200, unit: "m" },
  { label: "3km", value: 3, unit: "km" },
  { label: "1マイル", value: 1.60934, unit: "mile" },
  { label: "1600m", value: 1600, unit: "m" },
  { label: "1500m", value: 1500, unit: "m" },
];


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

	const [correction, setCorrection] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasVdot, setHasVdot] = useState(false); // DBにVdotデータがあるかを判定
	const [vdotData, setVdotData] = useState<{
		id: number | null;
		user_id: number | null;
		distance_value: string;
		distance_unit: string;
		elevation: number | null;
		temperature: number | null;
		time: { hh: string; mm: string; ss: string };
		pace: { mm: string; ss: string; unit: string };
	}>({
		id: null,
		user_id: null, // 初期値をnullとして型を明示
		distance_value: "",
		distance_unit: "",
		elevation: null,
		temperature: null,
		time: { hh: "00", mm: "00", ss: "00" },
		pace: { mm: "", ss: "", unit: "km" },
	});

// user のデータ取得後に処理
useEffect(() => {
  if (user) {
    setVdotData((prevData) => ({
      ...prevData,
      user_id: user.id, // number 型を代入
    }));
    setLoading(false); // user 取得完了後にローディング終了
  }
}, [user]);

	// TODO コンポーネントごとにAPIとやり取りするのはいまいちなので、
	// 認証や情報の取得は一つのコンポーネントでやるようにする
	// 一つのコンポーネントに3つのコンポーネントを読み込んで画面を切り替えるようにする方がいいかも
  // Vdotデータを取得
  useEffect(() => {
    const fetchVdotData = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:8000/api/vdots`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
				console.log("data", data);

				if (Array.isArray(data) && data.length > 0) {
					const vdot = data[0]; // 取得したデータの最初の要素を取得
					const [hh, mm, ss] = vdot.time.split(":"); // "00:17:45" → ["00", "17", "45"]

					setVdotData(prevData => ({
							...prevData,
							...vdot,
							time: { hh, mm, ss }, // timeをオブジェクトに変換
					}));

					setHasVdot(true);
			} else {
					setHasVdot(false);
			}
      } catch (error) {
        console.error("Vdotデータの取得に失敗しました:", error);
      }
    };

    fetchVdotData();
  }, [user]);

  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistance = DISTANCES.find((d) => d.value.toString() === e.target.value);
    if (selectedDistance) {
      setVdotData({
        ...vdotData,
        distance_value: selectedDistance.value.toString(),
        distance_unit: selectedDistance.unit,
      });
    }
  };

  const handleTimeChange = (key: "hh" | "mm" | "ss", value: string) => {
    setVdotData({
      ...vdotData,
      time: { ...vdotData.time, [key]: value },
      pace: { mm: "", ss: "", unit: "km" }, // 時間変更時にペースをリセット
    });
  };

  const handlePaceChange = (key: "mm" | "ss" | "unit", value: string) => {
    setVdotData({
      ...vdotData,
      pace: { ...vdotData.pace, [key]: value },
      time: { hh: "00", mm: "00", ss: "00" }, // ペース変更時に時間をリセット
    });
  };

	const calculatePace = () => {
		const { distance_value, time, pace } = vdotData;
		if (!distance_value || (time.hh === "00" && time.mm === "00" && time.ss === "00")) return;
	
		const totalSeconds = parseInt(time.hh) * 3600 + parseInt(time.mm) * 60 + parseInt(time.ss);
		if (totalSeconds === 0) return;
	
		let distanceInKm = Number(distance_value);
	
		// 単位が `mile` の場合、kmに変換
		if (vdotData.distance_unit === "mile") {
			distanceInKm *= 1.60934;
		}
		// m単位のものはkmに変換
		if (vdotData.distance_unit === "m") {
			distanceInKm /= 1000;
		}
	
		// ペースを計算
		const pacePerKm = totalSeconds / distanceInKm; // 1km または 1mile あたりの秒数
		const paceMinutes = Math.floor(pacePerKm / 60);
		const paceSeconds = Math.round(pacePerKm % 60);
	
		const updatedPace = {
			mm: paceMinutes.toString().padStart(2, "0"),
			ss: paceSeconds.toString().padStart(2, "0"),
			unit: pace.unit,
		};
	
		console.log("calculatePace: Updated pace", updatedPace); // 更新後のデータを確認
	
		setVdotData((prevData) => ({
			...prevData,
			pace: updatedPace,
		}));
	};
	
  const calculateTime = () => {
    const { distance_value, pace } = vdotData;
    if (!distance_value || pace.mm === "" || pace.ss === "") return;

    const totalPaceMinutes = parseInt(pace.mm) + parseInt(pace.ss) / 60;
    const totalTimeMinutes = totalPaceMinutes * Number(distance_value);

    const hh = Math.floor(totalTimeMinutes / 60);
    const mm = Math.floor(totalTimeMinutes % 60);
    const ss = Math.round((totalTimeMinutes - Math.floor(totalTimeMinutes)) * 60);

    setVdotData({
      ...vdotData,
      time: { hh: hh.toString().padStart(2, "0"), mm: mm.toString().padStart(2, "0"), ss: ss.toString().padStart(2, "0") },
    });
  };

  const resetForm = () => {
    setVdotData({
      ...vdotData,
      distance_value: "",
      distance_unit: "",
      time: { hh: "00", mm: "00", ss: "00" },
      pace: { mm: "", ss: "", unit: "km" },
    });
  };

  // Vdotデータ送信
  const saveVdot = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const timeString = `${vdotData.time.hh}:${vdotData.time.mm}:${vdotData.time.ss}`;

    // vdotData のコピーを作成して pace を削除
    const { pace, ...requestData } = {
			...vdotData,
			time: timeString,
	};

		console.log("requestData", requestData);
		console.log("hasVdot", hasVdot);
		console.log("vdotData.id", vdotData.id);

    try {
      const method = hasVdot ? "PATCH" : "POST";
			const url = hasVdot 
			? `http://localhost:8000/api/vdots/${vdotData.id}/` // `id` を URL に含める
			: `http://localhost:8000/api/vdots/`;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("データの保存に失敗しました");
      }

      console.log("Vdotデータを保存しました:", requestData);
    } catch (error) {
      console.error("Vdotデータの保存に失敗しました:", error);
    }
  };

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
          <form className="w-1/3">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">距離</label>
              <select className="shadow border rounded w-full py-2 px-3" value={vdotData.distance_value} onChange={handleDistanceChange}>
                <option value="">選択してください</option>
                {DISTANCES.map((d) => (
                  <option key={d.label} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-bold mb-2">時間</label>
              <div className="flex space-x-2">
                <select value={vdotData.time.hh} onChange={(e) => handleTimeChange("hh", e.target.value)}>
                  {[...Array(24).keys()].map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={vdotData.time.mm} onChange={(e) => handleTimeChange("mm", e.target.value)}>
                  {[...Array(60).keys()].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={vdotData.time.ss} onChange={(e) => handleTimeChange("ss", e.target.value)}>
                  {[...Array(60).keys()].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

							<div className="mb-4">
								<label className="block text-sm font-bold mb-2">ペース (mm:ss)</label>
								<div className="flex space-x-2">
									<select value={vdotData.pace.mm || "00"} onChange={(e) => handlePaceChange("mm", e.target.value)}>
										{[...Array(60).keys()].map((m) => <option key={m} value={m.toString().padStart(2, "0")}>{m.toString().padStart(2, "0")}</option>)}
									</select>
									:
									<select value={vdotData.pace.ss || "00"} onChange={(e) => handlePaceChange("ss", e.target.value)}>
										{[...Array(60).keys()].map((s) => <option key={s} value={s.toString().padStart(2, "0")}>{s.toString().padStart(2, "0")}</option>)}
									</select>
									<select value={vdotData.pace.unit} onChange={(e) => handlePaceChange("unit", e.target.value)}>
										<option value="km">km</option>
										<option value="mile">mile</option>
									</select>
								</div>
							</div>


              <button type="button" onClick={vdotData.time.hh=="00" && vdotData.time.mm=="00" && vdotData.time.hh=="00"?  calculateTime: calculatePace} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">計算する</button>
              <button type="button" onClick={saveVdot} className="bg-green-500 text-white px-4 py-2 rounded mt-2">送信する</button>
              <button type="button" onClick={resetForm} className="bg-red-500 text-white px-4 py-2 rounded mt-2">リセット</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VdotTraining
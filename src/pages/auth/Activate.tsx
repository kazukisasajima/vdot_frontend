import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activateAccount } from "../../services/authAPI";

const Activate = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (uid && token) {
      activateAccount(uid, token)
        .then(() => {
          setMessage("アカウントが有効化されました！");
          setTimeout(() => navigate("/complete-signup"), 3000); // 3秒後にログイン画面へ
        })
        .catch(() => {
          setMessage("アクティベーションに失敗しました。");
        });
    }
  }, [uid, token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">アカウント有効化</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Activate;

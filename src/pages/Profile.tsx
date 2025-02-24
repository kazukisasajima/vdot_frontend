import { useEffect, useState } from "react";
import { fetchUser, updateUser } from "../services/authAPI";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { loadUser } from "../features/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchUser(token)
        .then((res) => {
          setEmail(res.data.email);
          setUsername(res.data.username || "");
        })
        .catch(() => setMessage("ユーザー情報の取得に失敗しました"));
    }
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(token, { username });
      dispatch(loadUser(token)); // Reduxの状態も更新
      setMessage("プロフィールを更新しました");
    } catch (error) {
      setMessage("更新に失敗しました");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">プロフィール編集</h2>
        <p className="mb-2">メールアドレス: {email}</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名"
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          更新
        </button>
        {message && <p className="mt-2 text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default Profile;

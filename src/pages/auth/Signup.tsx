import { useState } from "react";
import { registerUser } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRe_Password] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== re_password) {
      setMessage("パスワードが一致しません");
      return;
    }
    try {
      await registerUser(name, email, password, re_password);
      setMessage("確認メールを送信しました。メールを確認してください。");
      setTimeout(() => navigate("/login"), 3000); // 3秒後にログイン画面へ
    } catch (error) {
      setMessage("登録に失敗しました");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">サインアップ</h2>
        <input type="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" className="p-2 border rounded w-full mt-2" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" className="p-2 border rounded w-full mt-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" className="p-2 border rounded w-full mt-2" />
        <input type="password" value={re_password} onChange={(e) => setRe_Password(e.target.value)} placeholder="パスワード（確認）" className="p-2 border rounded w-full mt-2" />
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">登録</button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
      {/* サインアップに成功したら、仮登録完了画面に遷移させる */}
    </div>
  );
};

export default Signup;

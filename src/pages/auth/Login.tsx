import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { login } from "../../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { verifyAuthToken } from "../../features/authSlice";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await dispatch(login({ email, password })).unwrap();
      await dispatch(verifyAuthToken());
      navigate("/dashboard");
    } catch (err) {
      setError("ログインに失敗しました。メールアドレスまたはパスワードが間違っています。");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4">ログイン</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="メールアドレス" 
            className="p-2 border rounded w-full mb-2" 
            required
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="パスワード" 
            className="p-2 border rounded w-full mb-4" 
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
            ログイン
          </button>
          {/* パスワードリセットへのリンク */}
          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-blue-500 hover:underline">
              パスワードを忘れた方はこちら
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;

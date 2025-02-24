import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { changePassword } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }

    try {
      await dispatch(changePassword({ newPassword, confirmPassword, currentPassword })).unwrap();
      setSuccessMessage("パスワードが変更されました！");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("パスワードの変更に失敗しました");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6">パスワード変更</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="現在のパスワード"
            className="p-2 border rounded w-full mb-2"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="新しいパスワード"
            className="p-2 border rounded w-full mb-2"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="新しいパスワード（確認）"
            className="p-2 border rounded w-full mb-4"
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
            変更する
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ChangePassword;

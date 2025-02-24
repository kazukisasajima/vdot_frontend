import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordConfirm } from "../../services/authAPI";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const ResetConfirm = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    if (newPassword !== confirmPassword) {
      setMessage("パスワードが一致しません。");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordConfirm(uid!, token!, newPassword, confirmPassword);
      setMessage("パスワードが変更されました！");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("パスワード変更に失敗しました。");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4">パスワードリセット確認</h2>
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
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-500"}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "変更中..." : "パスワードを変更する"}
          </button>
          {message && (
            <p className={`mt-2 ${message.includes("失敗") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ResetConfirm;

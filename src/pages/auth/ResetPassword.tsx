import { useState } from "react";
import { resetPassword } from "../../services/authAPI";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setMessage("パスワードリセットのメールを送信しました。");
    } catch (error) {
      setMessage("メール送信に失敗しました。");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4">パスワードリセット</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="p-2 border rounded w-full mb-4"
            required
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-500"}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "リセットメール送信"}
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

export default ResetPassword;

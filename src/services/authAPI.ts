import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 認証が必要な API クライアント
const apiClientAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // クッキーを自動送信
});

// 認証不要な API クライアント
const apiClientPublic = axios.create({
  baseURL: BASE_URL,
});


// 認証不要な API
export const registerUser = async (name: string, email: string, password: string, re_password: string) => {
  return apiClientPublic.post(`/api/auth/users/`, { name, email, password, re_password });
};

export const activateAccount = async (uid: string, token: string) => {
  return apiClientPublic.post(`/api/auth/users/activation/`, { uid, token });
};

export const loginUser = async (email: string, password: string) => {
  // return apiClientPublic.post(`/api/auth/jwt/create/`, { email, password }, { withCredentials: true });
  return apiClientPublic.post(`/api/auth/login/`, { email, password }, { withCredentials: true });
};

export const resetPassword = async (email: string) => {
  return apiClientPublic.post(`/api/auth/users/reset_password/`, { email });
};

export const resetPasswordConfirm = async (uid: string, token: string, newPassword: string, reNewPassword: string) => {
  return apiClientPublic.post(`/api/auth/users/reset_password_confirm/`, {
    uid,
    token,
    new_password: newPassword,
    re_new_password: reNewPassword,
  });
};

// 認証が必要な API
export const fetchUser = async () => {
  return apiClientAuth.get(`/api/auth/users/me/`);
};

// ✅ 修正: `refreshToken` はクッキーで送信されるためリクエストボディ不要
export const refreshToken = async () => {
  console.log("🔄 `/api/auth/refresh/` をリクエスト");

  // return apiClientAuth.post(`/api/auth/jwt/refresh/`, {}); // ✅ クッキーでリフレッシュトークンを送信
  return apiClientAuth.post(`/api/auth/refresh/`, {}); // ✅ クッキーでリフレッシュトークンを送信
};

// ✅ 修正: `verifyToken` は `{"token": "アクセストークン"}` の形式で送信する必要がある

export const verifyToken = async () => {
  const response = await axios.post(
    "http://localhost:8000/api/auth/verify/",
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// ログアウト API は Django 側で `/api/auth/logout/` を実装する
export const logoutUser = async () => {
  return apiClientAuth.post(`/api/auth/logout/`);
};

export const deleteUser = async (current_password: string) => {
  return apiClientAuth.delete(`/api/auth/users/me/`, {
    data: { current_password },
  });
};

export const updateUser = async (username: string) => {
  return apiClientAuth.patch(`/api/auth/users/me/`, { username });
};

export const changePassword = async (newPassword: string, reNewPassword: string, currentPassword: string) => {
  return apiClientAuth.post(`/api/auth/users/set_password/`, {
    new_password: newPassword,
    re_new_password: reNewPassword,
    current_password: currentPassword,
  });
};

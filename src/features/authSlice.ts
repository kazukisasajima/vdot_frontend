import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser, refreshToken, loginUser, logoutUser, verifyToken } from "../services/authAPI";
import { changePassword as apiChangePassword } from "../services/authAPI";

interface AuthState {
  user: null | { email: string; username: string };
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

// ログイン
export const login = createAsyncThunk<void, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      await loginUser(email, password);
      await dispatch(verifyAuthToken());
      // await dispatch(loadUser());
    } catch (error) {
      return rejectWithValue("ログインに失敗しました");
    }
  }
);

// トークンの有効性を確認し、必要ならリフレッシュ
export const verifyAuthToken = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/verify",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔍 トークンの検証開始");
      await verifyToken();
      console.log("✅ トークンの検証成功");
    } catch (error) {
      console.error("❌ トークンの検証失敗", error);
      try {
        console.log("🔄 トークンのリフレッシュを試行");
        await dispatch(refreshAuthToken()).unwrap();  // ✅ `unwrap()` を追加
        console.log("✅ トークンのリフレッシュ成功");
      } catch (refreshError) {
        console.error("❌ トークンのリフレッシュ失敗", refreshError);
        dispatch(logout());
        return rejectWithValue("トークンの検証に失敗しました");
      }
    }
  }
);


// 認証
export const loadUser = createAsyncThunk<{ email: string; username: string }, void, { rejectValue: string }>(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUser();
      return response.data;
    } catch (error) {
      return rejectWithValue("認証情報の取得に失敗しました");
    }
  }
);

// リフレッシュトークン
export const refreshAuthToken = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 リフレッシュトークンの送信");
      const response = await refreshToken();
      console.log("✅ リフレッシュトークン成功", response);
    } catch (error) {
      console.error("❌ リフレッシュトークン失敗", error);
      return rejectWithValue("トークンの更新に失敗しました");
    }
  }
);


// ログアウト
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { dispatch }) => {
    await logoutUser();
    dispatch(clearAuthState());
  }
);

// パスワード変更
export const changePassword = createAsyncThunk<void, { newPassword: string; confirmPassword: string; currentPassword: string }, { rejectValue: string }>(
  "auth/changePassword",
  async ({ newPassword, confirmPassword, currentPassword }, { rejectWithValue }) => {
    try {
      await apiChangePassword(newPassword, confirmPassword, currentPassword);
    } catch (error) {
      return rejectWithValue("パスワードの変更に失敗しました");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(refreshAuthToken.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(verifyAuthToken.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(verifyAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;

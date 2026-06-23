import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../app/api/axios";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoggedIn: !!storedToken && !!storedUser,
  loading: false,
  error: null,
};

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Signup thunk
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (
    credentials: { fullName: string; email: string; password: string; confirmPassword: string; phone: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/signup", credentials);
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Signup failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    loadUserFromStorage(state) {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (user && token) {
        state.user = JSON.parse(user);
        state.token = token;
        state.isLoggedIn = true;
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logoutUser, loadUserFromStorage, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

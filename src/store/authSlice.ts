import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const stored = localStorage.getItem("auth_user");
const initialUser: User | null = stored ? JSON.parse(stored) : null;

const initialState: AuthState = {
  user: initialUser,
  isLoggedIn: !!initialUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<{ name: string; email: string }>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    logoutUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("auth_user");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

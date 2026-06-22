import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  adminName: string | null;
}

const stored = localStorage.getItem("admin_session");
const initialAdmin: { name: string } | null = stored ? JSON.parse(stored) : null;

const initialState: AdminAuthState = {
  isAdminLoggedIn: !!initialAdmin,
  adminName: initialAdmin?.name ?? null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogin(state, action: PayloadAction<{ name: string }>) {
      state.isAdminLoggedIn = true;
      state.adminName = action.payload.name;
      localStorage.setItem("admin_session", JSON.stringify({ name: action.payload.name }));
    },
    adminLogout(state) {
      state.isAdminLoggedIn = false;
      state.adminName = null;
      localStorage.removeItem("admin_session");
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
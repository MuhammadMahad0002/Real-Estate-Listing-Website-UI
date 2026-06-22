import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminAuthReducer from "./adminAuthSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

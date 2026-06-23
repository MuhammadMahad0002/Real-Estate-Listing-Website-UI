import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, signupUser, logoutUser, clearAuthError } from "../store/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, loading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const signup = useCallback(
    (fullName: string, email: string, password: string, confirmPassword: string, phone: string) => {
      return dispatch(signupUser({ fullName, email, password, confirmPassword, phone }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return { user, isLoggedIn, loading, error, login, signup, logout, clearError };
}

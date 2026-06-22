import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, logoutUser } from "../store/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (name: string, email: string) => {
      dispatch(loginUser({ name, email }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return { user, isLoggedIn, login, logout };
}

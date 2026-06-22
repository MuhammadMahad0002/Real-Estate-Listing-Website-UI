import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { adminLogin, adminLogout } from "../store/adminAuthSlice";

export function useAdminAuth() {
  const dispatch = useAppDispatch();
  const { isAdminLoggedIn, adminName } = useAppSelector((state) => state.adminAuth);

  const loginAdmin = useCallback(
    (name: string) => {
      dispatch(adminLogin({ name }));
    },
    [dispatch]
  );

  const logoutAdmin = useCallback(() => {
    dispatch(adminLogout());
  }, [dispatch]);

  return { isAdminLoggedIn, adminName, loginAdmin, logoutAdmin };
}

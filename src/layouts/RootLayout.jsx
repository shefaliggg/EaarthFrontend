import { Outlet } from "react-router-dom";
import { AuthProvider } from "../features/auth/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
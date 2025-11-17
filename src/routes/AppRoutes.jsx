import { Routes, Route } from "react-router-dom";
import authRoutes from "../features/auth/routes/auth.routes";

const AppRoutes = () => (
  <Routes>
    {authRoutes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    ))}
  </Routes>
);

export default AppRoutes;

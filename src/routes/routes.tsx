import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import HomePage from "../pages/home";

export const Router = () => {

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};

import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import AccountPage from "../pages/account";
import ChatPage from "../pages/chat";
import HomePage from "../pages/home";
import LandingPage from "../pages/landing-page";
import { ProjectDetailsPage } from "../pages/projects/project-details";
import WalletPage from "../pages/wallet";

export const Router = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route
          path="/projects/details/:projectId"
          element={<ProjectDetailsPage />}
        />
      </Route>

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};

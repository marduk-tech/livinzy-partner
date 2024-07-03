import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import AccountPage from "../pages/account";
import ChatPage from "../pages/chat";
import HomePage from "../pages/home";
import Landing from "../pages/landing";
import { ProjectDetails } from "../pages/project-details";
import WalletPage from "../pages/wallet";
import { ProjectAdd } from "../pages/project-add";

export const Router = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/login" element={<Landing />} />
        <Route
          path="/projects/details/:projectId"
          element={<ProjectDetails />}
        />
        <Route path="/projects/new/:projectId?" element={<ProjectAdd />} />
      </Route>

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};

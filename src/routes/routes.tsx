import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import HomePage from "../pages/home";
import AccountPage from "../pages/account";
import WalletPage from "../pages/wallet";
import ChatPage from "../pages/chat";
import LandingPage from "../pages/landing-page";
import { useGetDesignerByEmail } from "../hooks/use-designers";
import { useAuth0 } from "@auth0/auth0-react";

export const Router = () => {
  const { user } = useAuth0();
  const { data } = useGetDesignerByEmail(user?.email || "");

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/login" element={<LandingPage />} />
      </Route>

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};

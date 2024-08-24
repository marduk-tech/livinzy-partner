import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app.tsx";
import { CustomAuth0Provider } from "./components/auth/auth0-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomAuth0Provider>
        <App />
      </CustomAuth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

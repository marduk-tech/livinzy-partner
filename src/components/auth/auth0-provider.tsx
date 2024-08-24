import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth0CallbackUrl,
  auth0ClientId,
  auth0Domain,
} from "../../libs/constants";

export const CustomAuth0Provider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const domain = auth0Domain;
  const clientId = auth0ClientId;
  const redirectUri = auth0CallbackUrl;

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

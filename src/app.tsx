import { App as AntApp, ConfigProvider } from "antd";

// Global Styles
import "./styles/globals.scss";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./libs/react-query/query-client";
import { Router } from "./routes/routes";
import { antTheme } from "./theme/ant-theme";

/**
 * Main App component
 * @returns The root component of the application
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Apply Ant Design theme configuration */}
      <ConfigProvider theme={antTheme}>
        {/* Wrap the entire app with Ant Design's App component */}
        <AntApp>
          {/* Render the main router component */}
          <Router />
        </AntApp>
      </ConfigProvider>

      {/* Include React Query Devtools (initially closed) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

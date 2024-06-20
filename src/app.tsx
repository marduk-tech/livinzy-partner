import { App as AntApp, ConfigProvider } from "antd";

// Global Styles
import "./styles/globals.scss";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./libs/react-query/query-client";
import { Router } from "./routes/routes";
import { antTheme } from "./theme/ant-theme";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antTheme}>
        <AntApp>
          <Router />
        </AntApp>
      </ConfigProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

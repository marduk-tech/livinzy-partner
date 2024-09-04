import { Alert } from "antd";

interface ErrorAlertProps {
  error: unknown;
}

/**
 * Component for displaying an error message
 * @param error The error to display
 */
export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <Alert
      message="Uh Oh. Something went wrong"
      description={error?.toString() || "Please try again."}
      type="error"
      showIcon
    />
  );
}

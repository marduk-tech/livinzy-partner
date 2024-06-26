import { Alert } from "antd";
import { useState } from "react";

interface ErrorAlertProps {
  error: unknown;
}

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

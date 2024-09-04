import { Popconfirm } from "antd";
import React, { ReactElement, useState } from "react";

export interface DeletePopconfirmProps {
  children: ReactElement | ReactElement[];
  title: string;
  description: string;
  handleOk: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Component for rendering a delete confirmation popover
 * @param children React elements to trigger the popover
 * @param title Title of the popover
 * @param description Description in the popover
 * @param handleOk Function to call when confirmed
 * @param isLoading Boolean to indicate if the action is loading
 */
export function DeletePopconfirm({
  children,
  title,
  description,
  handleOk,
  isLoading,
}: DeletePopconfirmProps) {
  const [open, setOpen] = useState(false);

  /**
   * Shows the popconfirm
   */
  const showPopconfirm = () => {
    setOpen(true);
  };

  /**
   * Handles the confirmation
   */
  const _handleOk = async () => {
    await handleOk();
    setOpen(false);
  };

  /**
   * Handles cancellation
   */
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popconfirm
      title={title}
      description={description}
      open={open}
      onConfirm={_handleOk}
      okButtonProps={{ loading: isLoading }}
      onCancel={handleCancel}
      placement="right"
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          onClick: showPopconfirm,
        })
      )}
    </Popconfirm>
  );
}

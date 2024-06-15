import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
}

const AddDesignerDialog: React.FC<Props> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((error) => console.error("Validation failed:", error));
  };

  return (
    <Modal
      title="Add Designer"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="designerName"
          label="Designer Name"
          rules={[{ required: true, message: "Please enter designer name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="websiteUrl"
          label="Website URL"
          rules={[{ required: true, message: "Please enter website URL" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile"
          rules={[{ required: true, message: "Please enter mobile number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="bio" label="Bio">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="profilePicture" label="Profile Picture URL">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDesignerDialog;

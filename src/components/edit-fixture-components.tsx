import { Flex, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import { FixtureComponent } from "../interfaces/Fixture";
import { WorkTypes } from "../libs/constants";

interface EditFixtureComponentsProps {
  component?: FixtureComponent;
  open: boolean;
  setOpen: (open: boolean) => void;
  updateFixture: ({
    fixtureComponent,
    action,
  }: {
    fixtureComponent: FixtureComponent;
    action: "ADD" | "UPDATE" | "DELETE";
  }) => void;
  confirmLoading: boolean;
}

export const EditFixtureComponents: React.FC<EditFixtureComponentsProps> = ({
  component,
  open,
  setOpen,
  updateFixture,
  confirmLoading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (component) {
      form.setFieldsValue({
        ...component,
      });
    } else {
      form.resetFields();
    }
  }, [component, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (component?._id) {
        updateFixture({
          fixtureComponent: { _id: component?._id, ...values },
          action: "UPDATE",
        });
      } else {
        updateFixture({ fixtureComponent: { ...values }, action: "ADD" });
      }

      form.resetFields();
    } catch (error: unknown) {}
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title={
          component ? "Edit Fixture Component" : "Create Fixture Component"
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Confirm"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
          onFinish={handleOk}
        >
          <Flex vertical>
            <Form.Item name={"commonName"} label="Standard name">
              <Input />
            </Form.Item>
            <Form.Item name={"originalName"} label="Custom name">
              <Input />
            </Form.Item>

            <Form.Item
              name={"workType"}
              label="Work Type"
              rules={[{ required: true, message: "Please select work type" }]}
            >
              <Select
                style={{ width: "100%" }}
                options={WorkTypes}
                placeholder="Work types"
                filterOption={(input, option: any) => {
                  return (
                    option?.label.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  );
                }}
              />
            </Form.Item>

            <Form.Item name={"brand"} label="Brand">
              <Input />
            </Form.Item>

            <Form.Item name={"material"} label="Material">
              <Input />
            </Form.Item>

            <Form.Item name={"cost"} label="Cost">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

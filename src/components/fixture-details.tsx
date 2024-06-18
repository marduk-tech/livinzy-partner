import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Spin, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { getFixtureMeta } from "../hooks/use-meta";
import { FixtureMeta } from "../interfaces/Meta";

interface FixtureModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (fixture: any) => void;
  fixture?: any;
}

const FixtureDetails: React.FC<FixtureModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
  fixture,
}) => {
  const [form] = Form.useForm();
  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  useEffect(() => {
    if (fixture) {
      form.setFieldsValue({
        ...fixture,
        fixtureType: fixture.fixtureType._id
      });
    }
  }, fixture)

  const { data: fixtureMetaData, isPending: fixtureMetaDataPending } =
  getFixtureMeta();

  return (
    <Modal
      title={fixture ? "Edit Fixture" : "Add Fixture"}
      footer={null}
      open={isOpen}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={fixture}
        onFinish={handleFinish}
      >
        <Form.Item
          name="fixtureType"
          label="Type"
          rules={[{ required: true, message: "Please enter the type" }]}
        >
          {fixtureMetaDataPending ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Please select a space"
                filterOption={(input, option) => (`${option?.label}` || '').toLowerCase().includes(input.toLowerCase())}
                options={fixtureMetaData.map((fixtureMeta: FixtureMeta) => {
                  return {
                    value: fixtureMeta._id,
                    label: fixtureMeta.fixtureType,
                  };
                })}
              >
              </Select>
            )}
        </Form.Item>
        <Form.Item
          name="designName"
          label="Design Name"
          rules={[{ required: true, message: "Please enter the design name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ marginLeft: 8 }}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FixtureDetails;

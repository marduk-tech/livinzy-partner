import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spin,
  Select,
  Input,
  Divider,
  Space,
  InputRef,
  Typography,
  Flex,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { getFixtureMeta, useSaveFixtureMeta } from "../hooks/use-meta";
import { FixtureMeta } from "../interfaces/Meta";
import { PlusOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";
import { cookieKeys } from "../libs/react-query/constants";
import { COLORS } from "../styles/colors";

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
  const inputRef = useRef<InputRef>(null);
  const saveFixtureMetaMutation = useSaveFixtureMeta();
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);
  const [autoSelectFixtureMeta, setAutoSelectFixtureMeta] = useState<string>();

  const {
    data: fixtureMetaData,
    isPending: fixtureMetaDataPending,
    refetch: refetchFixtureMeta,
  } = getFixtureMeta();

  const [form] = Form.useForm();
  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  const onClickAddFixture = () => {
    if (
      inputRef.current &&
      inputRef.current.input &&
      inputRef.current.input.value
    ) {
      console.log(inputRef.current.input.value);
      saveFixtureMetaMutation.mutate(
        {
          fixtureType: inputRef.current.input.value,
          addedByDesignerId: cookies[cookieKeys.userId],
        },
        {
          onSuccess: async (response: FixtureMeta) => {
            setAutoSelectFixtureMeta(response._id!);
            refetchFixtureMeta();
          },
          onError: () => {},
        }
      );
    }
  };

  useEffect(() => {
    if (autoSelectFixtureMeta) {
      setTimeout(() => {
        form.setFieldsValue({
          fixtureType: autoSelectFixtureMeta,
        });
      }, 500);
    }
  }, [fixtureMetaData]);

  useEffect(() => {
    if (fixture) {
      form.setFieldsValue({
        ...fixture,
        fixtureType: fixture.fixtureType._id,
      });
    } else {
      form.resetFields();
    }
  }, fixture);

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0, marginBottom: 24 }}>
          {fixture ? "Edit Fixture" : "Add Fixture"}
        </Typography.Title>
      }
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
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Flex vertical>
                      <Typography.Text
                        style={{
                          marginTop: 8,
                          marginBottom: 8,
                          color: COLORS.textColorLight,
                        }}
                      >
                        Couldn't find it in the list ? Add custom fixture
                      </Typography.Text>
                      <Flex>
                        <Input
                          placeholder="Enter the name of fixture"
                          ref={inputRef}
                          style={{ width: 200 }}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={onClickAddFixture}
                        >
                          Add
                        </Button>
                      </Flex>
                    </Flex>
                  </Space>
                </>
              )}
              placeholder="Please select a fixture type"
              filterOption={(input, option) =>
                (`${option?.label}` || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={fixtureMetaData.map((fixtureMeta: FixtureMeta) => {
                return {
                  value: fixtureMeta._id,
                  label: fixtureMeta.fixtureType,
                };
              })}
            ></Select>
          )}
        </Form.Item>

        {/* <Form.Item
          name="designName"
          label="Design Name"
          rules={[{ required: true, message: "Please enter the design name" }]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item name="cost" label="Cost (approx)">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="description" label="One liner about this fixture">
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

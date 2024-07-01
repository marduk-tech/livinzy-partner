import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  InputRef,
  Modal,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import { getFixtureMeta, useSaveFixtureMeta } from "../hooks/use-meta";
import { Fixture } from "../interfaces/Fixture";
import { FixtureMeta } from "../interfaces/Meta";
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
  const { projectId } = useParams();

  const [selectExisting, setSelectExisting] = useState<boolean>(!fixture);

  const {
    data: fixtureMetaData,
    isPending: fixtureMetaDataPending,
    refetch: refetchFixtureMeta,
  } = getFixtureMeta();

  const {
    data: projectFixtures,
    isPending: fixturesDataPending,
    refetch: refetchProjectFixtures,
  } = useFetchFixturesByProject(projectId as string);

  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (values.existingFixtureId) {
      const existingFixture = projectFixtures.find(
        (f: Fixture) => f._id === values.existingFixtureId
      );

      onSubmit(existingFixture);
    } else {
      values.slideId = fixture?.slideId;
      onSubmit(values);
    }
  };

  const onChangeFixtureType = (value: string) => {
    const fixtureType = fixtureMetaData.find(
      (f: FixtureMeta) => f._id == value
    );
    form.setFieldsValue({
      designName: fixtureType.fixtureType,
    });
  };

  const onClickAddFixture = () => {
    if (
      inputRef.current &&
      inputRef.current.input &&
      inputRef.current.input.value
    ) {
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
      afterClose={() => {
        form.resetFields();
      }}
      title={
        <Typography.Title level={4} style={{ margin: 0, marginBottom: 24 }}>
          {fixture ? "Edit Fixture" : "Add Fixture"}
        </Typography.Title>
      }
      footer={null}
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      {!fixture ? (
        <Button
          type="link"
          style={{ padding: 0, fontSize: 16, marginLeft: "auto" }}
          onClick={() => {
            setSelectExisting(!selectExisting);
          }}
        >
          {!selectExisting
            ? "I want to add a new fixture"
            : "I want to select an existing added fixture"}
        </Button>
      ) : null}

      <Form
        form={form}
        layout="vertical"
        initialValues={fixture}
        onFinish={handleFinish}
      >
        {selectExisting ? (
          <Form.Item noStyle shouldUpdate>
            {({ getFieldsValue }) => {
              const values = getFieldsValue();

              const showResetBtn =
                values.fixtureType || values.cost || values.description;

              const disable = values.existingFixtureId;

              return (
                <>
                  <Form.Item
                    name="fixtureType"
                    label="Type"
                    rules={[
                      {
                        required: disable ? false : true,
                        message: "Please enter the type",
                      },
                    ]}
                  >
                    {fixtureMetaDataPending ? (
                      <Spin />
                    ) : (
                      <Select
                        onChange={onChangeFixtureType}
                        disabled={disable}
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
                                  Couldn't find it in the list ? Add custom
                                  fixture
                                </Typography.Text>
                                <Flex>
                                  <Input
                                    placeholder="Enter the name of fixture"
                                    ref={inputRef}
                                    style={{ width: 300 }}
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
                        options={fixtureMetaData.map(
                          (fixtureMeta: FixtureMeta) => {
                            return {
                              value: fixtureMeta._id,
                              label: fixtureMeta.fixtureType,
                            };
                          }
                        )}
                      ></Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    name="designName"
                    label="Custom name for the fixture"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a custom name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="cost" label="Cost (approx)">
                    <Input type="number" disabled={disable} />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="One liner about this fixture"
                  >
                    <TextArea rows={2} disabled={disable} />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
        ) : (
          <Form.Item noStyle shouldUpdate>
            {({ getFieldsValue }) => {
              const values = getFieldsValue();

              const disable =
                values.fixtureType || values.cost || values.description;

              if (fixturesDataPending) {
                return <Spin />;
              }

              if (projectFixtures.length > 0) {
                const uniqueOptions = Array.from(
                  new Set(
                    projectFixtures.map((fixture: Fixture) => fixture._id)
                  )
                ).map((id) => {
                  const fixture = projectFixtures.find(
                    (f: Fixture) => f._id === id
                  );
                  return {
                    value: id,
                    label:
                      fixture.designName || fixture?.fixtureType?.fixtureType,
                  };
                });

                return (
                  <>
                    <Flex align="center" gap={5} justify="center">
                      <Form.Item
                        style={{ flex: 1 }}
                        name="existingFixtureId"
                        label="Select Existing"
                        rules={[
                          {
                            required: disable ? false : true,
                            message: "Please select fixture",
                          },
                        ]}
                      >
                        {fixturesDataPending ? (
                          <Spin />
                        ) : (
                          <Select
                            disabled={disable}
                            showSearch
                            placeholder="Please select a fixture"
                            filterOption={(input, option) =>
                              (`${option?.label}` || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={uniqueOptions}
                          ></Select>
                        )}
                      </Form.Item>

                      {values.existingFixtureId && (
                        <Button
                          onClick={() => form.resetFields()}
                          icon={<CloseCircleOutlined />}
                          size="small"
                          type="text"
                          style={{
                            marginTop: 5,
                          }}
                        ></Button>
                      )}
                    </Flex>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        margin: "8px 0",
                      }}
                    ></div>
                  </>
                );
              }
            }}
          </Form.Item>
        )}

        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FixtureDetails;

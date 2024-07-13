import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UngroupOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Divider,
  Flex,
  Form,
  Input,
  InputRef,
  message,
  Modal,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useGenerateOneLiner } from "../hooks/use-ai";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import {
  getFixtureMaterialFinishesMetaByMaterial,
  getFixtureMaterialVariationsMetaByMaterial,
  getFixtureMeta,
  useSaveFixtureMeta,
} from "../hooks/use-meta";
import { useFetchSlidesByProject } from "../hooks/use-slides";
import { Fixture } from "../interfaces/Fixture";
import {
  FixtureMeta,
  MaterialFinishMeta,
  MaterialMeta,
  MaterialVariationMeta,
} from "../interfaces/Meta";
import { Slide } from "../interfaces/Slide";
import { cookieKeys } from "../libs/react-query/constants";
import { COLORS } from "../styles/colors";
import TagInput from "./common/tag-input";
import { Loader } from "./loader";
import { filterFixtures } from "./project-details/slide-fixture-mapping";

interface FixtureModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (fixture: any) => void;
  fixture?: any;
  slide?: Slide;
}

const FixtureDetails: React.FC<FixtureModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
  fixture,
  slide,
}) => {
  const inputRef = useRef<InputRef>(null);
  const saveFixtureMetaMutation = useSaveFixtureMeta();
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);
  const [autoSelectFixtureMeta, setAutoSelectFixtureMeta] = useState<string>();
  const { projectId } = useParams();
  const [selectExisting, setSelectExisting] = useState<boolean>(!fixture);
  const generateOneLinerMutation = useGenerateOneLiner();

  const [materials, setMaterials] = useState([]);
  const [variations, setVariations] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");

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

  const { data: materialVariations } =
    getFixtureMaterialVariationsMetaByMaterial(selectedMaterial);
  const { data: materialFinishes } =
    getFixtureMaterialFinishesMetaByMaterial(selectedMaterial);

  const { data: projectSlides, isPending: projectSlidesPending } =
    useFetchSlidesByProject(projectId as string);

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
      material: "",
    });

    setSelectedMaterial("");
    setMaterials(fixtureType.materials);
  };

  const handleMaterialChange = async (value: string) => {
    setSelectedMaterial(value);
    form.resetFields(["materialVariation", "materialFinish"]);
  };

  /**
   * When a new fixture is added by the designer
   */
  const onClickAddNewFixture = () => {
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

  const onClickGenerateOneLiner = async (designName: string) => {
    await generateOneLinerMutation.mutateAsync(
      {
        designName: designName,
        projectId: projectId as string,
        fixtureId: fixture ? fixture._id : null,
        slideId: fixture ? undefined : slide?._id,
      },
      {
        onSuccess: (response: any) => {
          form.setFieldsValue({
            description: response,
          });
        },
        onError: () => {
          message.error("Could not generate description");
        },
      }
    );
  };

  useEffect(() => {
    setFinishes(materialFinishes);
    setVariations(materialVariations);
  }, [materialFinishes, materialVariations]);

  useEffect(() => {
    // Auto select the fixture type once a new fixture meta is added.
    if (autoSelectFixtureMeta) {
      setTimeout(() => {
        form.setFieldsValue({
          fixtureType: autoSelectFixtureMeta,
        });
      }, 500);
    }
  }, [fixtureMetaData]);

  const onModalToggle = (open: boolean) => {
    if (open && fixture) {
      const fixtureType = fixtureMetaData.find(
        (f: FixtureMeta) => f._id == fixture.fixtureType._id
      );
      setMaterials(fixtureType.materials);
      if (fixture.material) {
        setSelectedMaterial(fixture.material);
      }
      form.setFieldsValue({
        ...fixture,
        fixtureType: fixture.fixtureType._id,
      });
    } else {
      setMaterials([]);
    }
    console.log(open);
  };

  if (fixturesDataPending || projectSlidesPending || fixtureMetaDataPending) {
    return <Loader />;
  }

  if (projectFixtures && projectSlides && fixtureMetaData) {
    const existingFixturesOptions = Array.from(
      new Set(
        // removes fixtures which are not assigned to any slides
        filterFixtures(projectFixtures, projectSlides).map(
          (fixture: Fixture) => fixture._id
        )
      )
    )
      .filter((id) => slide && !slide.fixtures?.includes(id as string))
      .map((id) => {
        const fixture = projectFixtures.find((f: Fixture) => f._id === id);

        return {
          value: id,
          label: fixture.designName || fixture?.fixtureType?.fixtureType,
        };
      })
      .filter((item) => item !== null);

    return (
      <Modal
        afterOpenChange={onModalToggle}
        destroyOnClose={true}
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
        width={900}
      >
        {existingFixturesOptions.length > 0 && (
          <>
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
          </>
        )}

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {selectExisting ? (
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                return (
                  <>
                    <Flex gap={16}>
                      <Form.Item
                        name="fixtureType"
                        label="Type"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the type",
                          },
                        ]}
                      >
                        <Select
                          onChange={onChangeFixtureType}
                          showSearch
                          style={{ height: 56, width: 516 }}
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
                                      style={{ width: 250 }}
                                      onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      type="link"
                                      icon={<PlusOutlined />}
                                      loading={
                                        saveFixtureMetaMutation.isPending
                                      }
                                      onClick={onClickAddNewFixture}
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
                          options={fixtureMetaData
                            .sort(
                              (f1: FixtureMeta, f2: FixtureMeta) =>
                                (f2.materials || []).length -
                                (f1.materials || []).length
                            )
                            .map((fixtureMeta: FixtureMeta) => {
                              return {
                                value: fixtureMeta._id,
                                label: fixtureMeta.fixtureType,
                              };
                            })}
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        name="designName"
                        label="Give it a custom name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a custom name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Flex>
                    <Form.Item name="cost" label="Cost (approx)">
                      <Input type="number" />
                    </Form.Item>
                    <Collapse
                      style={{ marginBottom: 16 }}
                      items={[
                        {
                          key: "1",
                          label: (
                            <Typography.Title level={5} style={{ margin: 0 }}>
                              More Details
                            </Typography.Title>
                          ),
                          children: (
                            <>
                              {materials && materials.length ? (
                                <Flex gap={16}>
                                  <Form.Item
                                    name="material"
                                    style={{ width: 250 }}
                                    label="Material"
                                  >
                                    <Select
                                      allowClear={true}
                                      placeholder="Select a material"
                                      onChange={handleMaterialChange}
                                      options={materials.map(
                                        (material: MaterialMeta) => ({
                                          label: material.name,
                                          value: material._id,
                                        })
                                      )}
                                    ></Select>
                                  </Form.Item>

                                  {variations && variations.length ? (
                                    <Form.Item
                                      name="materialVariation"
                                      label="Sub material"
                                      rules={[{ required: !!selectedMaterial }]}
                                    >
                                      <Select
                                        style={{ width: 250 }}
                                        placeholder="Select sub material"
                                        disabled={!selectedMaterial}
                                        options={variations.map(
                                          (
                                            variation: MaterialVariationMeta
                                          ) => ({
                                            label: variation.name,
                                            value: variation._id,
                                          })
                                        )}
                                      ></Select>
                                    </Form.Item>
                                  ) : null}
                                  {finishes && finishes.length ? (
                                    <Form.Item
                                      name="materialFinish"
                                      label="Material finish"
                                      rules={[{ required: !!selectedMaterial }]}
                                    >
                                      <Select
                                        style={{ width: 250 }}
                                        placeholder="Select a finish"
                                        disabled={!selectedMaterial}
                                        options={finishes.map(
                                          (finish: MaterialFinishMeta) => ({
                                            label: finish.name,
                                            value: finish._id,
                                          })
                                        )}
                                      ></Select>
                                    </Form.Item>
                                  ) : null}
                                </Flex>
                              ) : null}

                              <Form.Item
                                name="customFittings"
                                label={
                                  <Flex gap={4}>
                                    <Typography.Text>
                                      Enter any custom fittings or material
                                    </Typography.Text>{" "}
                                    <Tooltip title="You can add any type of custom fitting or material not available in the above list.">
                                      <InfoCircleOutlined></InfoCircleOutlined>
                                    </Tooltip>
                                  </Flex>
                                }
                                style={{ width: 516 }}
                              >
                                <TagInput
                                  initialTags={
                                    fixture ? fixture.customFittings : null
                                  }
                                  onTagsChange={(tags: String[]) => {
                                    form.setFieldsValue({
                                      customFittings: tags,
                                    });
                                  }}
                                ></TagInput>
                              </Form.Item>
                              <Form.Item
                                style={{ margin: 0 }}
                                name={["description"]}
                                label="One liner about this fixture in 400 chars or less"
                              >
                                <TextArea
                                  rows={5}
                                  maxLength={400}
                                  style={{ fontSize: "110%" }}
                                />
                              </Form.Item>
                              <Button
                                disabled={!getFieldValue("designName")}
                                icon={<UngroupOutlined />}
                                type="link"
                                style={{
                                  padding: 0,
                                  textAlign: "left",
                                  margin: 0,
                                }}
                                onClick={() =>
                                  onClickGenerateOneLiner(
                                    getFieldValue("designName")
                                  )
                                }
                                loading={generateOneLinerMutation.isPending}
                              >
                                {generateOneLinerMutation.isPending
                                  ? "Generating description from designs.."
                                  : "AI Generate"}
                              </Button>
                            </>
                          ),
                        },
                      ]}
                    ></Collapse>
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

                if (projectFixtures.length > 0 && projectSlides.length > 0) {
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
                          <Select
                            disabled={disable}
                            showSearch
                            placeholder="Please select a fixture"
                            filterOption={(input, option) =>
                              (`${option?.label}` || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={existingFixturesOptions}
                          ></Select>
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
  }
};

export default FixtureDetails;

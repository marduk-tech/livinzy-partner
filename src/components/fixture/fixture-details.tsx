import {
  CloseCircleOutlined,
  PlusOutlined,
  UngroupOutlined,
} from "@ant-design/icons";
import {
  Space as AntSpace,
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
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGenerateOneLiner } from "../../hooks/use-ai";
import { useFetchFixturesByProject } from "../../hooks/use-fixtures";
import { getFixtureMeta, useSaveFixtureMeta } from "../../hooks/use-meta";
import { useFetchSlidesByProject } from "../../hooks/use-slides";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { useUser } from "../../hooks/use-user";
import { Fixture } from "../../interfaces/Fixture";
import { FixtureMeta } from "../../interfaces/Meta";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { COLORS } from "../../styles/colors";
import { Loader } from "../common/loader";
import { FixtureComponents } from "./fixture-components";

interface FixtureModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (fixture: any) => void;
  fixture?: any;
  slide?: Slide;
  space?: Space;
}

/**
 * Component for displaying and editing fixture details
 * @param isOpen Boolean to control the visibility of the modal
 * @param onCancel Function to call when the modal is cancelled
 * @param onSubmit Function to call when the form is submitted
 * @param fixture The fixture data, if editing an existing fixture
 * @param slide The current slide data
 * @param space The current space data
 */
const FixtureDetails: React.FC<FixtureModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
  fixture,
  slide,
  space,
}) => {
  const inputRef = useRef<InputRef>(null);
  const saveFixtureMetaMutation = useSaveFixtureMeta();
  const { user } = useUser();
  const [autoSelectFixtureMeta, setAutoSelectFixtureMeta] = useState<string>();
  const { projectId } = useParams();
  const [selectExisting, setSelectExisting] = useState<boolean>(true);
  const generateOneLinerMutation = useGenerateOneLiner();

  const {
    data: allSpaces,
    isLoading: allSpacesLoading,
    refetch: refetchAllSpaces,
  } = useFetchSpacesByProject(projectId!);

  const [materials, setMaterials] = useState([]);
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

  const { data: projectSlides, isPending: projectSlidesPending } =
    useFetchSlidesByProject(projectId as string);

  const [form] = Form.useForm();

  /**
   * Handles the form submission
   * @param values The form values
   */
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

  /**
   * Handles the change of fixture type
   * @param value The selected fixture type ID
   */
  const onChangeFixtureType = (value: string) => {
    const fixtureType = fixtureMetaData.find(
      (f: FixtureMeta) => f._id == value
    );
    form.setFieldsValue({
      designName:
        fixtureType && fixtureType.fixtureType ? fixtureType.fixtureType : "",
      material: "",
    });

    setSelectedMaterial("");
    setMaterials(fixtureType.materials);
  };

  /**
   * Handles the change of material
   * @param value The selected material
   */
  const handleMaterialChange = async (value: string) => {
    setSelectedMaterial(value);
    form.resetFields(["materialVariation", "materialFinish"]);
  };

  /**
   * Handles adding a new fixture type
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
          addedByDesignerId: user._id,
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

  /**
   * Generates a one-liner description for the fixture
   * @param designName The design name of the fixture
   */
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
    // Auto select the fixture type once a new fixture meta is added.
    if (autoSelectFixtureMeta) {
      setTimeout(() => {
        form.setFieldsValue({
          fixtureType: autoSelectFixtureMeta,
        });
      }, 500);
    }
  }, [fixtureMetaData]);

  useEffect(() => {
    setSelectExisting(false);
  }, [isOpen]);

  /**
   * Handles the opening and closing of the modal
   * @param open Boolean indicating if the modal is open
   */
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
  };

  if (
    fixturesDataPending ||
    projectSlidesPending ||
    fixtureMetaDataPending ||
    allSpacesLoading
  ) {
    return <Loader />;
  }

  /**
   * Filters fixtures by space
   * @param space The space to filter by
   * @param fixtures The list of all fixtures
   * @returns Filtered list of fixtures
   */
  function filterFixturesBySpace(space: Space, fixtures: Fixture[]) {
    const fixtureIdsInSpace = space.fixtures.map((fixture) => fixture._id);

    return fixtures.filter((fixture) =>
      fixtureIdsInSpace.includes(fixture._id)
    );
  }

  if (projectFixtures && projectSlides && fixtureMetaData && space) {
    const formattedFixtures = filterFixturesBySpace(space, projectFixtures);

    const existingFixturesOptions = formattedFixtures
      .filter(
        // Filter fixtures that are mapped to the space and not already mapped to the slide
        (fixture: Fixture) =>
          slide && !slide.fixtures?.includes(fixture._id as string)
      )
      .map((fix: Fixture) => {
        const spaceMappedToFixture = allSpaces.find((space: Space) =>
          space.fixtures.map((sf: Fixture) => sf._id).includes(fix._id)
        );
        return {
          value: fix._id,
          label: (
            <Flex vertical>
              <Typography.Text
                style={{
                  color: COLORS.textColorLight,
                  textTransform: "uppercase",
                }}
              >
                {spaceMappedToFixture ? spaceMappedToFixture.name : " "}
              </Typography.Text>
              <Typography.Text>
                {fix.designName ||
                  (!!fix.fixtureType ? fix?.fixtureType?.fixtureType : "")}
              </Typography.Text>
            </Flex>
          ),
        };
      })
      .filter((item: any) => item !== null);

    return (
      <Modal
        afterOpenChange={onModalToggle}
        destroyOnClose={true}
        title={
          <Typography.Title level={4} style={{ margin: 0, marginBottom: 24 }}>
            {fixture ? `Edit Fixture` : "Add Fixture"}
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
                {selectExisting
                  ? "I want to add a new fixture"
                  : "I want to select an existing added fixture"}
              </Button>
            ) : null}
          </>
        )}

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {!selectExisting ? (
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
                              <AntSpace style={{ padding: "0 8px 4px" }}>
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
                              </AntSpace>
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
                    <>
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
                          onClickGenerateOneLiner(getFieldValue("designName"))
                        }
                        loading={generateOneLinerMutation.isPending}
                      >
                        {generateOneLinerMutation.isPending
                          ? "Generating description from designs.."
                          : "AI Generate"}
                      </Button>
                    </>

                    {fixture && (
                      <Collapse
                        style={{ marginBottom: 16 }}
                        items={[
                          {
                            key: "1",
                            label: (
                              <Typography.Title level={5} style={{ margin: 0 }}>
                                Fixture components
                              </Typography.Title>
                            ),
                            children: <FixtureComponents fixture={fixture} />,
                          },
                        ]}
                      ></Collapse>
                    )}
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
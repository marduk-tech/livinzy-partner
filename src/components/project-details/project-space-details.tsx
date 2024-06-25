import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Flex,
  message,
  Spin,
  Select,
  Typography,
  Empty,
  Card,
  Image,
  Alert,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useDeleteSpace,
  useFetchSpacesByProject,
  useSaveSpace,
} from "../../hooks/use-spaces";
import { ProjectDetailsProps } from "../../interfaces/Project";
import { Space } from "../../interfaces/Space";
import { queryClient } from "../../libs/react-query/query-client";
import { queryKeys } from "../../libs/react-query/constants";
import { getSpaceMeta } from "../../hooks/use-meta";
import { SpaceMeta } from "../../interfaces/Meta";
import { useProcessSpacesLayout } from "../../hooks/use-ai";
import { COLORS } from "../../styles/colors";
import TextArea from "antd/es/input/TextArea";
import { SpacesIcon } from "../../libs/icons";

const ProjectSpaceDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
}) => {
  const {
    data: spaces,
    isLoading,
    refetch: refetchSpaces,
  } = useFetchSpacesByProject(projectData!._id!);
  const { data: spaceMetaData, isPending: spaceMetaDataPending } =
    getSpaceMeta();

  const deleteSpaceMutation = useDeleteSpace();
  const saveSpaceMutation = useSaveSpace();
  const processSpacesLayoutMutation = useProcessSpacesLayout();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [form] = Form.useForm();

  const [processingSpaces, setProcessingSpaces] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading || (spaces && !!spaces.length)) {
      return;
    }
    async function fetchSpacesInfo() {
      setProcessingSpaces(true);
      // const spacesLayoutDetails = await processSpacesLayout(
      //   projectData!._id!
      // );
      processSpacesLayoutMutation.mutate(projectData!._id!, {
        onSuccess: async () => {
          setProcessingSpaces(false);
          refetchSpaces();
        },
        onError: () => {
          setProcessingSpaces(false);
          refetchSpaces();
        },
      });
    }
    if (projectData && projectData.homeDetails.layout2D) {
      fetchSpacesInfo();
    }
  }, [projectData, spaces]);

  const showModal = (space: Space | undefined) => {
    setIsEdit(!!space);
    setCurrentSpace(space);
    form.resetFields();
    if (space) {
      form.setFieldsValue({
        ...space,
        spaceType: space.spaceType._id,
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    deleteSpaceMutation.mutate(id, {
      onSuccess: async () => {
        message.success("Space removed successfully!");
        await queryClient.invalidateQueries({
          queryKey: [queryKeys.getSpaces],
        });
      },
      onError: () => {
        message.error("Failed to remove space.");
      },
    });
  };

  const onChangeSpaceType = (value: string) => {
    const spaceType = spaceMetaData.find((s: SpaceMeta) => s._id == value);
    form.setFieldsValue({
      name: spaceType.spaceType,
    });
  };
  /**
   * When form is submitted.
   * @param updatedSpaceData
   */
  const handleFinish = (updatedSpaceData: Space) => {
    updatedSpaceData.projectId = projectData!._id!;
    if (currentSpace) {
      updatedSpaceData._id = currentSpace._id;
    }
    saveSpaceMutation.mutate(updatedSpaceData, {
      onSuccess: async () => {
        message.success("Space saved successfully!");
        await queryClient.invalidateQueries({
          queryKey: [queryKeys.getSpaces],
        });
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });
    setIsModalVisible(false);
  };

  if (processingSpaces) {
    return (
      <Flex gap={16} style={{ marginTop: 64 }}>
        <Spin tip="Loading" size="small"></Spin>
        <Typography.Text>
          Processing layout for spaces. Please wait..
        </Typography.Text>
      </Flex>
    );
  }

  if (isLoading) {
    return <Spin>Loading...</Spin>;
  }

  return (
    <>
      {spaces && spaces.length ? (
        <Flex vertical>
          <Flex gap={16} style={{ marginBottom: 16 }} align="center">
            <Alert
              message={
                <Flex gap={8} align="center">
                  <SpacesIcon></SpacesIcon>
                  <Typography.Text>
                    You can add all the spaces which you have designed for this
                    project
                  </Typography.Text>
                </Flex>
              }
              type="info"
            />
            <Button
              type="link"
              size="small"
              style={{
                marginLeft: "auto",
                padding: 0,
                color: COLORS.primaryColor,
              }}
              onClick={() => showModal(undefined)}
              icon={<PlusOutlined />}
            >
              Add Space
            </Button>
          </Flex>

          {isLoading ? (
            <Spin size="small">Loading..</Spin>
          ) : (
            <Flex
              gap={16}
              style={{
                flexWrap: "wrap",
              }}
            >
              {spaces.map((space: Space) => {
                return (
                  <Card style={{ width: 300, height: 200 }}>
                    <Image
                      src={
                        space.spaceType.icon
                          ? space.spaceType.icon
                          : "../../app/gen-room.png"
                      }
                      height={40}
                      style={{ opacity: 0.5, marginBottom: 75 }}
                    ></Image>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {space.name}
                    </Typography.Title>
                    <Typography.Text
                      style={{
                        color: COLORS.textColorLight,
                      }}
                    >
                      {space.spaceType.spaceType}
                      {space.size ? `, ${space.size.l}x${space.size.w} in` : ""}
                    </Typography.Text>
                    <Flex gap={16} style={{ marginTop: 8 }}>
                      <Button
                        type="link"
                        style={{
                          padding: 0,
                          height: 32,
                          color: COLORS.primaryColor,
                        }}
                        icon={<EditOutlined />}
                        onClick={() => showModal(space)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="link"
                        style={{
                          padding: 0,
                          height: 32,
                          color: COLORS.primaryColor,
                        }}
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(space._id!)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Card>
                );
              })}
              <Flex
                onClick={() => {
                  showModal(undefined);
                }}
                justify="center"
                align="center"
                style={{
                  cursor: "pointer",
                  width: 300,
                  height: 200,
                  border: "2px dashed",
                  borderColor: COLORS.borderColor,
                  borderRadius: 8,
                }}
                gap={16}
              >
                <SpacesIcon></SpacesIcon>
                <Typography.Text style={{ color: COLORS.textColorLight }}>
                  + Add Space
                </Typography.Text>
              </Flex>
            </Flex>
          )}

          {/* <List
            loading={isLoading}
            dataSource={spaces}
            grid={{ gutter: 24, column: 3 }}
            renderItem={(space: Space) => (
              <Card>
                <Image
                  src={
                    space.spaceType.icon
                      ? space.spaceType.icon
                      : "../../app/gen-room.png"
                  }
                  height={40}
                  style={{ opacity: 0.5, marginBottom: 75 }}
                ></Image>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {space.name}
                </Typography.Title>
                <Typography.Text
                  style={{
                    color: COLORS.textColorLight,
                  }}
                >
                  {space.spaceType.spaceType}
                  {space.size ? `, ${space.size.l}x${space.size.w} in` : ""}
                </Typography.Text>
                <Flex gap={16} style={{ marginTop: 8 }}>
                  <Button
                    type="link"
                    style={{
                      padding: 0,
                      height: 32,
                      color: COLORS.primaryColor,
                    }}
                    icon={<EditOutlined />}
                    onClick={() => showModal(space)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    style={{
                      padding: 0,
                      height: 32,
                      color: COLORS.primaryColor,
                    }}
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(space._id!)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Card>
            )}
          /> */}
        </Flex>
      ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          description={
            <Typography.Text>
              Add spaces to your project like kitchen, bedroom etc.
            </Typography.Text>
          }
        >
          <Button type="primary" onClick={() => showModal(undefined)}>
            Add Now
          </Button>
        </Empty>
      )}
      <Modal
        title={isEdit ? "Edit Space" : "Add Space"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="spaceType"
            label="Type"
            rules={[{ required: true, message: "Please input the type!" }]}
          >
            {spaceMetaDataPending ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Please select a space"
                filterOption={(input, option) =>
                  (`${option?.label}` || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={onChangeSpaceType}
                options={spaceMetaData.map((spaceMeta: SpaceMeta) => {
                  return {
                    value: spaceMeta._id,
                    label: spaceMeta.spaceType,
                  };
                })}
              ></Select>
            )}
          </Form.Item>
          <Form.Item
            name="name"
            label="Unique name for the space"
            rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="cost" label="Cost">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="oneLiner" label="One liner about this space">
            <TextArea rows={4} />
          </Form.Item>
          <Flex gap={8}>
            <Form.Item name={["size", "l"]} label="Length">
              <Input type="number" width={25} />
            </Form.Item>
            <Form.Item name={["size", "w"]} label="Width">
              <Input type="number" width={25} />
            </Form.Item>
          </Flex>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectSpaceDetails;

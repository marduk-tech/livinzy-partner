import React, { useState } from "react";
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
  Image,
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
import { COLORS } from "../../styles/colors";
import { convertInchToFeet } from "../../libs/lvnzy-helper";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [form] = Form.useForm();

  const [processingSpaces, setProcessingSpaces] = useState<boolean>(false);

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
        <Flex vertical style={{ height: 500, overflowY: "scroll" }}>
          <Flex gap={16} style={{ marginBottom: 16 }} align="center">
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
              vertical
              gap={16}
              style={{
                flexWrap: "wrap",
              }}
            >
              {spaces.map((space: Space) => {
                return (
                  <Flex
                    style={{
                      width: "100%",
                      height: 75,
                      border: "1px solid",
                      borderColor: COLORS.borderColor,
                      borderRadius: 8,
                      padding: 16,
                    }}
                    align="center"
                    gap={16}
                  >
                    <Image
                      src={
                        space.spaceType.icon
                          ? space.spaceType.icon
                          : "../../app/gen-room.png"
                      }
                      width={38}
                      style={{ opacity: 0.5 }}
                    ></Image>
                    <Flex vertical>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {space.name}
                      </Typography.Title>
                      <Typography.Text
                        style={{
                          color: COLORS.textColorLight,
                        }}
                      >
                        {space.spaceType.spaceType}
                        {space.size
                          ? `, ${convertInchToFeet(
                              space.size.l
                            )}x${convertInchToFeet(space.size.w)} ft`
                          : ""}
                      </Typography.Text>
                    </Flex>
                    <Flex gap={16} style={{ marginTop: 8, marginLeft: "auto" }}>
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
                  </Flex>
                );
              })}
            </Flex>
          )}
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
          {/* <Form.Item name="cost" label="Cost">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="oneLiner" label="One liner about this space">
            <TextArea rows={4} />
          </Form.Item> */}
          <Flex gap={8}>
            <Form.Item name={["size", "l"]} label="Length (Optional)">
              <Input type="number" width={25} />
            </Form.Item>
            <Form.Item name={["size", "w"]} label="Width (Optional)">
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

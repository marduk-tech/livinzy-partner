import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  List,
  Modal,
  Flex,
  message,
  Spin,
  Select,
  Tag,
  Typography,
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
import { SyncOutlined } from "@ant-design/icons";
import { useProcessSpacesLayout } from "../../hooks/use-ai";
import { COLORS } from "../../styles/colors";

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

  return (
    <>
      <Flex vertical>
        <Button
          type="default"
          size="small"
          style={{ marginBottom: 16, marginLeft: "auto" }}
          onClick={() => showModal(undefined)}
          icon={<PlusOutlined />}
        >
          Add Space
        </Button>
        <List
          loading={isLoading}
          style={{ width: 500, height: 600, overflow: "scroll" }}
          dataSource={spaces}
          itemLayout="horizontal"
          renderItem={(space: Space) => (
            <Flex
              align="center"
              gap={16}
              style={{
                borderBottom: "1px solid",
                borderColor: COLORS.borderColor,
              }}
            >
              <Flex vertical style={{ padding: 16 }}>
                <Typography.Title level={4} style={{ margin: 0, width: 300 }}>
                  {space.name}
                </Typography.Title>
                  <Typography.Text
                    style={{
                      margin: 0,
                      width: 300,
                      color: COLORS.textColorLight,
                    }}
                  >
                    {space.spaceType.spaceType}{space.size ? `, ${space.size.l}x${space.size.w} in`: ''}
                  </Typography.Text>
              </Flex>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<EditOutlined />}
                onClick={() => showModal(space)}
              >
                Edit
              </Button>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(space._id!)}
              >
                Delete
              </Button>
            </Flex>
          )}
        />
      </Flex>
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
            label="Name for the space"
            rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="cost"
            label="Cost"
          >
            <Input type="number" />
          </Form.Item>
          <Flex gap={8}>
            <Form.Item
              name={["size", "l"]}
              label="Length"
            >
              <Input type="number" width={25} />
            </Form.Item>
            <Form.Item
              name={["size", "w"]}
              label="Width"
            >
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

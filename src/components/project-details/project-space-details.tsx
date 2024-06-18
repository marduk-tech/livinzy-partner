import React, { useState } from "react";
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
const { Option } = Select;

const ProjectSpaceDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
}) => {
  const { data: spaces, isLoading } = useFetchSpacesByProject(
    projectData!._id!
  );
  const { data: spaceMetaData, isPending: spaceMetaDataPending } =
    getSpaceMeta();

  const deleteSpaceMutation = useDeleteSpace();
  const saveSpaceMutation = useSaveSpace();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [form] = Form.useForm();

  const showModal = (space: Space | undefined) => {
    setIsEdit(!!space);
    setCurrentSpace(space);
    form.resetFields();
    if (space) {
      form.setFieldsValue({
        ...space,
        spaceType: space.spaceType._id
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

  return (
    <>
      <Flex vertical>
        <List
          loading={isLoading}
          style={{ width: 500 }}
          dataSource={spaces}
          itemLayout="horizontal"
          renderItem={(space: Space) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => showModal(space)}
                >
                  Edit
                </Button>,
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(space._id!)}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`${space.spaceType.spaceType}, ₹${space.cost}`}
                description={
                  space.size
                    ? `Size: L=${space.size.l}, W=${space.size.w}, H=${space.size.h}`
                    : ""
                }
              />
            </List.Item>
          )}
        />
        <Button
          type="default"
          size="small"
          style={{ width: 150, marginTop: 32 }}
          onClick={() => showModal(undefined)}
          icon={<PlusOutlined />}
        >
          Add Space
        </Button>
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
                filterOption={(input, option) => (`${option?.label}` || '').toLowerCase().includes(input.toLowerCase())}
                options={spaceMetaData.map((spaceMeta: SpaceMeta) => {
                  return {
                    value: spaceMeta._id,
                    label: spaceMeta.spaceType,
                  };
                })}
              >
              </Select>
            )}
          </Form.Item>
          <Form.Item
            name="cost"
            label="Cost"
            rules={[{ required: true, message: "Please input the cost!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Flex gap={8}>
            <Form.Item
              name={["size", "l"]}
              label="Length"
              rules={[{ message: "Please input the length!" }]}
            >
              <Input type="number" width={25} />
            </Form.Item>
            <Form.Item
              name={["size", "w"]}
              label="Width"
              rules={[{ message: "Please input the width!" }]}
            >
              <Input type="number" width={25} />
            </Form.Item>
            <Form.Item
              name={["size", "h"]}
              label="Height"
              rules={[{ message: "Please input the height!" }]}
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

import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Flex, Form, Input, message, Modal, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeMeta } from "../../hooks/use-meta";
import { useDeleteProject, useSaveProject } from "../../hooks/use-projects";
import { HomeMeta } from "../../interfaces/Meta";
import { Project } from "../../interfaces/Project";
import { queryClient } from "../../libs/react-query/query-client";
import { queryKeys } from "../../libs/react-query/constants";
const { confirm } = Modal;

const { Option } = Select;

const INPUT_WIDTH = 400;

const ProjectSettings: React.FC<{
  projectData: Project;
  onProjectSaved: any;
}> = ({ projectData, onProjectSaved }) => {
  const [form] = Form.useForm();
  const saveProjectMutation = useSaveProject();

  const { data: homeMetaData, isPending: homeMetaDataPending } = getHomeMeta();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  /**
   * When the form values are changed
   */
  const onFormValuesChange = (changedValues: any, allValues: any) => {
    console.log(changedValues);
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);

    const allRequiredFieldsFilled =
      allValues.homeDetails.size && allValues.homeDetails.homeType;

    setIsSubmitDisabled(hasErrors || !allRequiredFieldsFilled);
  };

  useEffect(() => {
    if (projectData) {
      if (projectData.homeDetails) {
        form.setFieldsValue({
          ...projectData,
          homeDetails: {
            homeType: projectData.homeDetails.homeType,
            communityName: projectData.homeDetails.communityName,
            size: projectData.homeDetails.size,
          },
        });
      }
    }
  }, [projectData, form]);

  const saveProject = (projectUpdatedData: Project) => {
    if (projectData) {
      projectUpdatedData._id = projectData._id;
    }
    saveProjectMutation.mutate(projectUpdatedData, {
      onSuccess: () => {
        message.success("Project saved successfully");
        queryClient.invalidateQueries({
          queryKey: [queryKeys.getProject, projectData?._id],
        });
        onProjectSaved();
      },
      onError: () => {},
    });
  };
  const handleFinish = (projectUpdatedData: Project) => {
    saveProject(projectUpdatedData);
  };

  const deleteProjectMutation = useDeleteProject();
  const navigate = useNavigate();

  const showDeleteConfirm = () => {
    confirm({
      title: `Delete This Project`,
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to delete this project?"`,
      okText: `Delete ${projectData?.name && projectData.name}`,
      okType: "danger",
      cancelButtonProps: {
        type: "default",
        shape: "default",
      },
      onOk: async () => {
        await deleteProjectMutation
          .mutateAsync({
            projectId: projectData?._id as string,
          })
          .catch((err) => {
            message.error("Something went wrong please try again later");
          })
          .then((data: Project) => {
            if (data.archived) {
              message.success("Project deleted successfully");

              navigate("/");
            }
          });
      },
    });
  };

  return (
    <Flex style={{ marginTop: 32 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={onFormValuesChange}
      >
        <Form.Item
          name={["name"]}
          label="Project Name"
          rules={[{ required: true, message: "Enter any unique name" }]}
        >
          <Input style={{ width: INPUT_WIDTH }} />
        </Form.Item>

        <Form.Item
          name={["homeDetails", "homeType"]}
          label="Select Home Type"
          rules={[
            { required: true, message: "Please enter the apartment type" },
          ]}
        >
          {homeMetaDataPending ? (
            <Spin />
          ) : (
            <Select showSearch placeholder="Please select an item">
              {homeMetaData.map((homeMeta: HomeMeta) => (
                <Option key={homeMeta._id} value={homeMeta._id}>
                  {homeMeta.homeType}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name={["homeDetails", "size"]}
          label="Size (sq ft)"
          rules={[{ required: true, message: "Please enter the size" }]}
        >
          <Input type="number" style={{ width: INPUT_WIDTH }} />
        </Form.Item>

        <Button
          danger
          type="link"
          onClick={showDeleteConfirm}
          style={{ padding: 0 }}
          loading={deleteProjectMutation.isPending}
        >
          I want to delete this project
        </Button>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => form.submit()}
            disabled={isSubmitDisabled}
            style={{ marginTop: 24 }}
            loading={saveProjectMutation.isPending}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ProjectSettings;

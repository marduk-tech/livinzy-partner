import React, { useEffect, useState } from "react";
import { Form, Input, Button, Spin, Select, Flex, message } from "antd";
import { useSaveProject } from "../../hooks/use-projects";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import { getHomeMeta } from "../../hooks/use-meta";
import { HomeMeta } from "../../interfaces/Meta";

const { Option } = Select;

const INPUT_WIDTH = 400;

const ProjectSettings: React.FC<ProjectDetailsProps> = ({
  projectData,
  basicDetailsUpdated,
  skipFloorplan,
}) => {
  const [form] = Form.useForm();
  const saveProjectMutation = useSaveProject();

  const { data: homeMetaData, isPending: homeMetaDataPending } = getHomeMeta();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  /**
   * When the form values are changed
   */
  const onFormValuesChange = (changedValues: any, allValues: any) => {
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
      onSuccess: (updatedProject: Project) => {
        message.success("Project saved successfully");
      },
      onError: () => {},
    });
  };
  const handleFinish = (projectUpdatedData: Project) => {
    saveProject(projectUpdatedData);
  };

  return (
    <Flex style={{ marginTop: 32 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={onFormValuesChange}
      >
        <Flex vertical>
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
        </Flex>
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

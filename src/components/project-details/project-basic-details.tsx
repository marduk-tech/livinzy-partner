import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Spin,
  Select,
  Radio,
  RadioChangeEvent,
  Flex,
} from "antd";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import { useSaveProject } from "../../hooks/use-projects";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import { useCookies } from "react-cookie";
import { cookieKeys } from "../../libs/react-query/constants";
import { getHomeMeta } from "../../hooks/use-meta";
import { HomeMeta } from "../../interfaces/Meta";
import { baseApiUrl } from "../../libs/constants";
import { COLORS } from "../../styles/colors";
import { fetchLayoutDetails, getLayoutDetails } from "../../hooks/use-ai";
const { Option } = Select;

const INPUT_WIDTH = 400;
const layoutOptions = [
  { label: "I have the layout of the home", value: "layout" },
  { label: "Dont have the layout", value: "manual" },
];

const ProjectBasicDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
  basicDetailsUpdated,
}) => {
  const [form] = Form.useForm();
  const saveProjectMutation = useSaveProject();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { data: homeMetaData, isPending: homeMetaDataPending } = getHomeMeta();
  const [layoutOption, setLayoutOption] = useState("layout");


  const handleFormChange = () => {
    setIsFormChanged(true); // Indicate form has changed
  };

  const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Assuming the response contains the URL in response.data.url
      console.log(info.file.response.data.Location);

      const layoutDetails = fetchLayoutDetails(info.file.response.data.Location);

      

      message.success('File uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Upload failed');
    }
  };

  useEffect(() => {
    if (projectData) {
      form.setFieldsValue({
        homeDetails: {
          homeType: projectData.homeDetails.homeType._id,
          communityName: projectData.homeDetails.communityName,
          size: projectData.homeDetails.size,
        },
      });
      if (projectData.previewImageUrl) {
        setFileList([
          {
            url: projectData.previewImageUrl,
            name: "Preview Image",
            status: "done",
          } as UploadFile,
        ]);
      }
    }
  }, [projectData, form]);

  const handleFinish = (projectUpdatedData: Project) => {
    projectUpdatedData.designerId = cookies[cookieKeys.userId];
    if (projectData && projectData!._id) {
      projectUpdatedData._id = projectData!._id;
    }

    saveProjectMutation.mutate(projectUpdatedData, {
      onSuccess: (updatedProject: Project) => {
        basicDetailsUpdated(updatedProject);
        message.success("Project saved successfully!");
      },
      onError: (err: any) => {
        message.error("Failed to save project.");
      },
    });
  };

  const onLayoutOptionChange = ({ target: { value } }: RadioChangeEvent) => {
    setLayoutOption(value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        name={["homeDetails", "communityName"]}
        label="Community Name"
        rules={[{ required: true, message: "Please enter the community name" }]}
      >
        <Input style={{ width: INPUT_WIDTH }} />
      </Form.Item>
      
      <Flex vertical>
      {!projectData || !projectData._id ? (
        <Radio.Group
          options={layoutOptions}
          onChange={onLayoutOptionChange}
          value={layoutOption}
          optionType="button"
          buttonStyle="solid"
          style={{marginBottom: 24}}
        />
      ) : null}

      {layoutOption == "layout" ? (<Upload
                    action={`${baseApiUrl}upload/single`}
                    name="image"
                    listType="picture"
                    onChange={handleUploadChange}
                    showUploadList={false}
                  >
                    <Button type="link" style={{color: COLORS.primaryColor, padding: 0}}>+ Upload Layout</Button>
                  </Upload>) : (
        <>
          <Form.Item
            name={["homeDetails", "homeType"]}
            label="Home Type"
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
        </>
      )}

      </Flex>
      <Form.Item style={{ marginTop: 48 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={saveProjectMutation.isPending}
          disabled={!isFormChanged}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProjectBasicDetails;

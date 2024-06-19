import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Spin,
  Select,
  Flex,
  Tag,
  Alert,
} from "antd";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import { useSaveProject } from "../../hooks/use-projects";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import { useCookies } from "react-cookie";
import { cookieKeys } from "../../libs/react-query/constants";
import { getHomeMeta } from "../../hooks/use-meta";
import { HomeMeta } from "../../interfaces/Meta";
import { IMG_AI_STATUS, baseApiUrl } from "../../libs/constants";
import { COLORS } from "../../styles/colors";
import { fetchLayoutDetails } from "../../hooks/use-ai";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const INPUT_WIDTH = 400;

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
  const [layoutImage, setLayoutImage] = useState<string>();

  const [layoutImageStatus, setLayoutImageStatus] = useState<string>();

  const handleFormChange = () => {
    setIsFormChanged(true); // Indicate form has changed
  };

  const handleUploadChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLayoutImageStatus(IMG_AI_STATUS.UPLOADING);
      return;
    }
    if (info.file.status === "done") {
      setLayoutImageStatus(IMG_AI_STATUS.PROCESSING);
      setLayoutImage(info.file.response.data.Location);

      // Fetching layout details using AI
      const layoutDetails = await fetchLayoutDetails(
        info.file.response.data.Location
      );

      const homeMetaType = homeMetaData.find(
        (h: HomeMeta) =>
          h.homeType.toLowerCase() == layoutDetails.type.toLowerCase()
      );
      if (homeMetaType) {
        setLayoutImageStatus(IMG_AI_STATUS.COMPLETED);
        form.setFieldsValue({
          homeDetails: {
            homeType: homeMetaType._id,
            size: parseFloat(layoutDetails.area),
          },
        });
      } else {
        setLayoutImageStatus(IMG_AI_STATUS.ERROR);
      }
    } else if (info.file.status === "error") {
      message.error("Upload failed");
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
    if (layoutImage) {
      projectUpdatedData.homeDetails.layout2D = layoutImage;
    }
    if (projectData && projectData!._id) {
      projectUpdatedData._id = projectData!._id;
    }

    saveProjectMutation.mutate(projectUpdatedData, {
      onSuccess: (updatedProject: Project) => {
        basicDetailsUpdated(updatedProject);
        message.success("Project saved successfully!");
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });
  };

  const renderImgStatus = () => {
    switch (layoutImageStatus) {
      case IMG_AI_STATUS.UPLOADING:
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Uploading..
          </Tag>
        );
      case IMG_AI_STATUS.PROCESSING:
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Image uploaded, processing..
          </Tag>
        );
      case IMG_AI_STATUS.COMPLETED:
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Processing completed
          </Tag>
        );
      case IMG_AI_STATUS.ERROR:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Processing completed
          </Tag>
        );
      default:
        return <></>;
    }
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
        <Alert
          message="You can upload the house layout to autopopulate values"
          type="info"
          showIcon
        />
        <Upload
          action={`${baseApiUrl}upload/single`}
          name="image"
          listType="picture"
          onChange={handleUploadChange}
          showUploadList={false}
        >
          {renderImgStatus()}
          <Button
            type="link"
            style={{ color: COLORS.primaryColor, padding: 0, marginBottom: 16 }}
          >
            + Upload
          </Button>
        </Upload>
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
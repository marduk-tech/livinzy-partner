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
  Typography,
  Empty,
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
import TextArea from "antd/es/input/TextArea";

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
  const [layoutUploadSkipped, setLayoutUploadSkipped] = useState(false);

  const { data: homeMetaData, isPending: homeMetaDataPending } = getHomeMeta();
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
        info.file.response.data.Location,
        true
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
        ...projectData,
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
  }, [projectData, form, layoutUploadSkipped]);

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
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Uploading floorplan..
          </Tag>
        );
      case IMG_AI_STATUS.PROCESSING:
        return (
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Uploading done, processing..
          </Tag>
        );
      case IMG_AI_STATUS.COMPLETED:
        return (
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<CheckCircleOutlined />}
            color="success"
          >
            Floorplan processed
          </Tag>
        );
      case IMG_AI_STATUS.ERROR:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Could not process floorplan
          </Tag>
        );
      default:
        return <></>;
    }
  };

  if (!projectData && !layoutUploadSkipped && !layoutImage) {
    return (
      <Empty
        image="../../floorplan.png"
        imageStyle={{ height: 120, marginTop: 32 }}
        description={
          <Typography.Text style={{ color: COLORS.textColorLight }}>
            Upload project floorplan to add details automatically
          </Typography.Text>
        }
      >
        <Flex vertical>
          <Upload
            action={`${baseApiUrl}upload/single`}
            name="image"
            listType="picture"
            onChange={handleUploadChange}
            showUploadList={false}
          >
            {renderImgStatus()}
            <Button type="primary">Upload</Button>
          </Upload>
          <Button
            type="link"
            style={{ color: COLORS.primaryColor }}
            onClick={() => {
              setLayoutUploadSkipped(true);
            }}
          >
            {" "}
            or add details manually
          </Button>
        </Flex>
      </Empty>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={handleFormChange}
    >
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
          + Upload Floorplan
        </Button>
      </Upload>
      <Form.Item
        name={["homeDetails", "communityName"]}
        label="Community Name"
        rules={[{ required: true, message: "Please enter the community name" }]}
      >
        <Input style={{ width: INPUT_WIDTH }} />
      </Form.Item>

      <Flex vertical>
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
          <Form.Item name={["oneLiner"]} label="One liner about this project">
            <TextArea rows={4} style={{ width: INPUT_WIDTH }} />
          </Form.Item>
        </>
      </Flex>
      <Form.Item>
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

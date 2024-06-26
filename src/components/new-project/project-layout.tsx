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
  Image,
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
import { fetchLayoutDetails, useProcessSpacesLayout } from "../../hooks/use-ai";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const INPUT_WIDTH = 400;

const ProjectLayout: React.FC<ProjectDetailsProps> = ({
  projectData,
  basicDetailsUpdated,
}) => {
  const [form] = Form.useForm();
  const saveProjectMutation = useSaveProject();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);
  const [layoutUploadSkipped, setLayoutUploadSkipped] = useState(false);

  const { data: homeMetaData, isPending: homeMetaDataPending } = getHomeMeta();
  const [layoutImage, setLayoutImage] = useState<string>();

  const [layoutImageStatus, setLayoutImageStatus] = useState<string>();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const processSpacesLayoutMutation = useProcessSpacesLayout();

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

  const handleUploadChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLayoutImageStatus(IMG_AI_STATUS.UPLOADING);
      return;
    }
    if (info.file.status === "done") {
      setLayoutImageStatus(IMG_AI_STATUS.PROCESSING);
      const layoutImg = info.file.response.data.Location;
      setLayoutImage(layoutImg);

      // Fetching layout details using AI
      const layoutDetails = await fetchLayoutDetails(layoutImg, true);

      const homeMetaType = homeMetaData.find(
        (h: HomeMeta) =>
          h.homeType.toLowerCase() == layoutDetails.type.toLowerCase()
      );
      if (homeMetaType) {
        projectData!.homeDetails = {
          homeType: homeMetaType._id,
          size: parseFloat(layoutDetails.area),
          layout2D: layoutImg!,
        };
        saveProject(projectData!);
      } else {
        setLayoutImageStatus(IMG_AI_STATUS.ERROR);
      }
    } else if (info.file.status === "error") {
      message.error("Upload failed");
    }
  };

  useEffect(() => {
    if (projectData) {
      if (projectData.homeDetails) {
        form.setFieldsValue({
          ...projectData,
          homeDetails: {
            homeType: projectData.homeDetails.homeType._id,
            communityName: projectData.homeDetails.communityName,
            size: projectData.homeDetails.size,
          },
        });
      }

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

  const saveProject = (projectUpdatedData: Project) => {
    saveProjectMutation.mutate(
      { ...projectData, ...projectUpdatedData },
      {
        onSuccess: (updatedProject: Project) => {
          if (
            updatedProject &&
            updatedProject.homeDetails &&
            updatedProject.homeDetails.layout2D
          ) {
            processSpacesLayoutMutation.mutate(projectData!._id!, {
              onSuccess: async () => {
                setLayoutImageStatus(IMG_AI_STATUS.COMPLETED);
                basicDetailsUpdated(updatedProject);
              },
              onError: () => {
                basicDetailsUpdated(updatedProject);
              },
            });
          } else {
            basicDetailsUpdated(updatedProject);
          }
        },
        onError: () => {},
      }
    );
  };
  const handleFinish = (projectUpdatedData: Project) => {
    saveProject(projectUpdatedData);
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

  if (!layoutUploadSkipped) {
    return (
      <Flex vertical style={{ padding: 48 }}>
        <Image src="../../floorplan.png" preview={false} width={100}></Image>
        <Typography.Title level={2}>
          Do you have the project floorplan ?
        </Typography.Title>
        <Flex vertical align="flex-start">
          <Upload
            action={`${baseApiUrl}upload/single`}
            name="image"
            listType="picture"
            onChange={handleUploadChange}
            showUploadList={false}
          >
            <Button type="primary" style={{ marginRight: 16 }}>
              Upload
            </Button>
            {renderImgStatus()}
          </Upload>
          {layoutImageStatus !== IMG_AI_STATUS.COMPLETED ? (
            <Button
              type="link"
              style={{ color: COLORS.primaryColor, padding: 0, marginTop: 16 }}
              onClick={() => {
                setLayoutUploadSkipped(true);
              }}
            >
              I would like to add details manually
            </Button>
          ) : null}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex style={{ padding: 48 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={onFormValuesChange}
      >
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
          </>
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
        <Button
          type="link"
          onClick={() => {
            setLayoutUploadSkipped(false);
          }}
          style={{ color: COLORS.primaryColor, padding: 0, marginBottom: 16 }}
        >
          I would like to upload floorplan instead
        </Button>
      </Form>
    </Flex>
  );
};

export default ProjectLayout;

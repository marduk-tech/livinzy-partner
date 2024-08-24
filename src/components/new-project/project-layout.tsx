import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Select,
  Spin,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import { fetchLayoutDetails, useProcessSpacesLayout } from "../../hooks/use-ai";
import { getHomeMeta } from "../../hooks/use-meta";
import { useSaveProject } from "../../hooks/use-projects";
import { HomeMeta } from "../../interfaces/Meta";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import { LAYOUT_AI_STATUS, baseApiUrl } from "../../libs/constants";
import { COLORS } from "../../styles/colors";

const { Option } = Select;

const INPUT_WIDTH = 400;

const ProjectLayout: React.FC<ProjectDetailsProps> = ({
  projectData,
  basicDetailsUpdated,
}) => {
  const [form] = Form.useForm();
  const saveProjectMutation = useSaveProject();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
      setLayoutImageStatus(LAYOUT_AI_STATUS.UPLOADING);
      return;
    }
    if (info.file.status === "done") {
      setLayoutImageStatus(LAYOUT_AI_STATUS.PROCESSING_SIZE);
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
        setLayoutImageStatus(LAYOUT_AI_STATUS.ERROR);
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
          setLayoutImageStatus(LAYOUT_AI_STATUS.PROCESSING_SPACES);
          if (
            updatedProject &&
            updatedProject.homeDetails &&
            updatedProject.homeDetails.layout2D
          ) {
            processSpacesLayoutMutation.mutate(projectData!._id!, {
              onSuccess: async () => {
                setLayoutImageStatus(LAYOUT_AI_STATUS.COMPLETED);
                setTimeout(() => {
                  basicDetailsUpdated(updatedProject);
                }, 1000);
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
      case LAYOUT_AI_STATUS.UPLOADING:
        return (
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Uploading floorplan..
          </Tag>
        );
      case LAYOUT_AI_STATUS.PROCESSING_SIZE:
        return (
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Floorplan uploaded, analysing size & home type..
          </Tag>
        );
      case LAYOUT_AI_STATUS.PROCESSING_SPACES:
        return (
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Size updated, finding all spaces..
          </Tag>
        );
      case LAYOUT_AI_STATUS.COMPLETED:
        return (
          <Tag
            style={{ fontSize: 16, padding: 8 }}
            icon={<CheckCircleOutlined />}
            color="success"
          >
            Floorplan processed succesfully
          </Tag>
        );
      case LAYOUT_AI_STATUS.ERROR:
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
      <Flex align="center" style={{ width: "100%" }}>
        <Flex vertical style={{ padding: 48, width: "40%" }}>
          <Typography.Title level={3}>
            Do you have the project floorplan ?
          </Typography.Title>
          <Flex vertical>
            <Upload
              action={`${baseApiUrl}upload/single`}
              name="image"
              listType="picture"
              onChange={handleUploadChange}
              showUploadList={false}
            >
              <Button
                disabled={
                  !!layoutImageStatus &&
                  layoutImageStatus !== LAYOUT_AI_STATUS.COMPLETED
                }
                type="primary"
                style={{ marginRight: 16 }}
              >
                Upload
              </Button>
            </Upload>
            <Flex style={{ marginTop: 16 }}>{renderImgStatus()}</Flex>
            <Button
              type="link"
              disabled={
                !!layoutImageStatus &&
                layoutImageStatus !== LAYOUT_AI_STATUS.COMPLETED
              }
              style={{
                color: COLORS.primaryColor,
                padding: 0,
                marginTop: 16,
                fontSize: 16,
                width: 200,
              }}
              onClick={() => {
                setLayoutUploadSkipped(true);
              }}
            >
              I would like to add details manually
            </Button>
          </Flex>
        </Flex>
        <Flex
          style={{
            width: "60%",
            height: "80vh",
            backgroundImage: `url(${
              layoutImage || "../../floorplan-icon.jpeg"
            })`,
            backgroundPosition: "center",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
          }}
        >
          {" "}
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
          style={{
            color: COLORS.primaryColor,
            padding: 0,
            marginBottom: 16,
            fontSize: 16,
          }}
        >
          I would like to upload floorplan instead
        </Button>
      </Form>
    </Flex>
  );
};

export default ProjectLayout;

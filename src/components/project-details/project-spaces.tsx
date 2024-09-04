import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Flex,
  Form,
  Image,
  message,
  Spin,
  Typography,
} from "antd";
import React, { useState } from "react";
import { getSpaceMeta } from "../../hooks/use-meta";
import {
  useDeleteSpace,
  useFetchSpacesByProject,
  useSaveSpace,
} from "../../hooks/use-spaces";
import { SpaceMeta } from "../../interfaces/Meta";
import { ProjectDetailsProps } from "../../interfaces/Project";
import { Space } from "../../interfaces/Space";
import { convertInchToFeet } from "../../libs/lvnzy-helper";
import { queryKeys } from "../../libs/react-query/constants";
import { queryClient } from "../../libs/react-query/query-client";
import { COLORS } from "../../styles/colors";
import SpaceDetails from "../space-details";

/**
 * Component for managing project space details
 * @param projectData The data of the current project
 * @param slide The current slide
 */
const ProjectSpaceDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
  slide,
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
  const [spaceDialogOpen, setSpaceDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [form] = Form.useForm();

  const [processingSpaces, setProcessingSpaces] = useState<boolean>(false);

  /**
   * Shows the modal for adding or editing a space
   * @param space The space to edit, or undefined for adding a new space
   */
  const showModal = (space: Space | undefined) => {
    setCurrentSpace(space);
    setSpaceDialogOpen(true);
  };

  /**
   * Handles the deletion of a space
   * @param id The ID of the space to delete
   */
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
   * Handles the change of space type
   * @param value The ID of the selected space type
   */
  const onChangeSpaceType = (value: string) => {
    const spaceType = spaceMetaData.find((s: SpaceMeta) => s._id == value);
    form.setFieldsValue({
      name: spaceType.spaceType,
    });
  };

  /**
   * Handles the form submission for saving a space
   * @param updatedSpaceData The updated space data from the form
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
      <SpaceDetails
        spaceDialogClosed={() => {
          setSpaceDialogOpen(false);
        }}
        slide={slide}
        spaceData={currentSpace!}
        projectId={projectData!._id!}
        showSpaceDialog={spaceDialogOpen}
      ></SpaceDetails>
    </>
  );
};

export default ProjectSpaceDetails;

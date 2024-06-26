import React, { useEffect, useState } from "react";
import { Button, Flex, Modal, Tooltip, Typography, message } from "antd";
import ImgsUpload from "../imgs-upload";
import {
  useBulkSaveSlides,
  useFetchSlidesByProject,
  useSaveSlide,
} from "../../hooks/use-slides";
import { ProjectDetailsProps } from "../../interfaces/Project";
import { Slide } from "../../interfaces/Slide";
import SlideSpaceMapping from "./slide-space-mapping";
import SlideFixtureMapping from "./slide-fixture-mapping";
import { COLORS } from "../../styles/colors";
import { useProcessSpacesInSlides } from "../../hooks/use-ai";
import { DesignsIcon } from "../../libs/icons";
import { RadiusSettingOutlined, SettingOutlined } from "@ant-design/icons";
import ProjectSpaceDetails from "./project-space-details";
import ProjectSettings from "./project-settings";

const ProjectSlideDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
}) => {
  const [selectedSlide, setSelectedSlide] = useState<Slide>();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isSpacesSettingsOpen, setIsSpacesSettingsOpen] = useState<boolean>();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>();

  const bulkSaveSlidesMutation = useBulkSaveSlides();
  const updateSlideMutation = useSaveSlide();
  const processSpacesInSlidesMutation = useProcessSpacesInSlides();

  const {
    data: slidesData,
    isPending: slidesDataPending,
    refetch: refetchSlidesData,
  } = useFetchSlidesByProject(projectData!._id!);

  useEffect(() => {
    if (!slidesData || !slidesData.length) {
      return;
    }
    setSlides(slidesData);
    setSelectedSlide(slidesData[0]);
  }, [slidesData]);

  useEffect(() => {
    if (!selectedSlide) {
      return;
    }
    if (!!selectedSlide.spaces && !!selectedSlide.spaces.length) {
      return;
    }
    processSpacesInSlidesMutation.mutate(
      { projectId: projectData!._id!, slideId: selectedSlide._id },
      {
        onSuccess: async (response: any) => {
          selectedSlide!.spaces = response.spaces;
          setSelectedSlide(selectedSlide);
        },
        onError: () => {},
      }
    );
  }, [selectedSlide]);

  const fixturesUpdated = (fixtures: string[]) => {
    selectedSlide!.fixtures = fixtures;
    updateSlideMutation.mutate(selectedSlide!, {
      onSuccess: async () => {
        message.success("Changes saved");
      },
      onError: () => {},
    });
  };

  const spacesUpdated = (spaces: string[]) => {
    selectedSlide!.spaces = spaces;
    updateSlideMutation.mutate(selectedSlide!, {
      onSuccess: async () => {
        message.success("Changes saved");
      },
      onError: () => {},
    });
  };

  const onClickDelete = (event: any) => {
    event.stopPropagation();
  };

  const onClickReplace = (event: any) => {
    event.stopPropagation();
  };

  /**
   * When thumbnail is clicked
   * @param slide
   */
  const handleThumbnailClick = (slide: Slide) => {
    setSelectedSlide(slide);
  };

  /** When slide images are uploaded */
  const imgsUploaded = (imgs: string[]) => {
    const slidesData = imgs.map((img: string) => {
      return {
        url: img,
        projectId: projectData!._id,
      };
    });

    bulkSaveSlidesMutation.mutate(slidesData, {
      onSuccess: async (response) => {
        setSlides([...slides, ...response]);
        if (!selectedSlide) {
          setSelectedSlide(response[0]);
        }
        message.success("Designs saved successfully!");

        // await queryClient.invalidateQueries({queryKey: [queryKeys.getSpaces]});
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });
  };

  if (slidesDataPending) {
    return <>Loading...</>;
  }

  if (!slidesDataPending && (!slides || !slides.length)) {
    return (
      <ImgsUpload
        confirmProcessing={true}
        imgsUploaded={imgsUploaded}
      ></ImgsUpload>
    );
  }

  return (
    <Flex vertical style={{ width: "100%" }}>
      <Modal
        open={isSpacesSettingsOpen}
        footer={null}
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Add or Edit Spaces
          </Typography.Title>
        }
        width={600}
        onCancel={() => {
          setIsSpacesSettingsOpen(false);
        }}
      >
        <ProjectSpaceDetails projectData={projectData}></ProjectSpaceDetails>{" "}
      </Modal>
      <Modal
        open={isSettingsOpen}
        footer={null}
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Update Details
          </Typography.Title>
        }
        width={600}
        onCancel={() => {
          setIsSettingsOpen(false);
        }}
      >
        <ProjectSettings projectData={projectData}></ProjectSettings>
      </Modal>
      <Flex align="center" gap={8}>
        <DesignsIcon></DesignsIcon>
        <Typography.Title
          level={3}
          style={{
            margin: 0,
            marginBottom: 0,
          }}
        >
          {projectData!.name}
        </Typography.Title>
        <Flex style={{ marginLeft: "auto" }}>
          <Button
            style={{ color: COLORS.primaryColor }}
            type="link"
            onClick={() => {
              setIsSpacesSettingsOpen(true);
            }}
            icon={<RadiusSettingOutlined />}
          >
            Spaces
          </Button>
          <Button
            style={{ color: COLORS.primaryColor }}
            type="link"
            onClick={() => {
              setIsSettingsOpen(true);
            }}
            icon={<SettingOutlined />}
          >
            Settings
          </Button>
        </Flex>
      </Flex>
      <Flex justify="center" style={{ marginTop: 24 }}>
        <Flex
          vertical
          style={{
            width: 100,
            height: 540,
            overflowY: "scroll",
            flexWrap: "nowrap",
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
          gap={16}
        >
          {slides.map((slide) => (
            <Flex
              style={{
                width: "100%",
                height: 80,
              }}
            >
              <Flex
                onClick={() => handleThumbnailClick(slide)}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: 80,
                  border:
                    slide._id == selectedSlide?._id
                      ? "4px solid"
                      : "0.5px solid",
                  borderColor:
                    slide._id == selectedSlide?._id
                      ? COLORS.primaryColor
                      : COLORS.borderColor,
                  borderRadius: 16,
                  backgroundImage: `url(${slide.url})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                }}
              >
                <Flex
                  style={{
                    padding: 2,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "#ddd",
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <Tooltip title="Click to delete">
                    {/* <Button
                      type="link"
                      onClick={onClickDelete}
                      icon={<DeleteOutlined></DeleteOutlined>}
                      style={{
                        color: "white",
                        width: 24,
                        height: 24,
                        padding: 0,
                        marginRight: 8,
                      }}
                    /> */}
                  </Tooltip>
                  <Tooltip title="Click to replace">
                    {/* <Button
                      type="link"
                      onClick={onClickReplace}
                      icon={<UndoOutlined></UndoOutlined>}
                      style={{
                        color: "white",
                        width: 24,
                        height: 24,
                        padding: 0,
                        marginRight: 8,
                      }}
                    /> */}
                  </Tooltip>
                </Flex>
              </Flex>
            </Flex>
          ))}
          <ImgsUpload
            imgsUploaded={imgsUploaded}
            confirmProcessing={false}
          ></ImgsUpload>
        </Flex>
        <div
          style={{
            width: "calc(100% - 440px)",
            height: 540,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 16,
            backgroundImage: `url(${selectedSlide!.url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <Flex vertical gap={16} style={{ width: 300 }}>
          <SlideSpaceMapping
            key="slide-spaces"
            isProcessing={processSpacesInSlidesMutation.isPending}
            onSpacesUpdated={spacesUpdated}
            projectId={projectData!._id!}
            slide={selectedSlide!}
          ></SlideSpaceMapping>
          <SlideFixtureMapping
            key="slide-fixtures"
            onFixturesUpdated={fixturesUpdated}
            projectId={projectData!._id!}
            slide={selectedSlide!}
          ></SlideFixtureMapping>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectSlideDetails;

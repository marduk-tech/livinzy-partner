import {
  DeleteOutlined,
  ExclamationCircleFilled,
  ExpandOutlined,
  RadiusSettingOutlined,
  SettingOutlined,
  SyncOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Image,
  Modal,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useProcessSpacesInSlides } from "../../hooks/use-ai";
import {
  useBulkSaveSlides,
  useDeleteSlide,
  useFetchSlidesByProject,
  useSaveSlide,
} from "../../hooks/use-slides";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { ProjectDetailsProps } from "../../interfaces/Project";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { baseAppUrl } from "../../libs/constants";
import { DesignsIcon } from "../../libs/icons";
import { COLORS } from "../../styles/colors";
import MobileFrame from "../common/mobile-frame";
import ImgsUpload from "../imgs-upload";
import { default as ProjectFixtureDetails } from "./all-fixtures";
import ProjectSettings from "./project-settings";
import ProjectSpaceDetails from "./project-space-details";
import SlideFixtureMapping from "./slide-fixture-mapping";
import SlideSpaceMapping from "./slide-space-mapping";
const { confirm } = Modal;

const ProjectSlideDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
}) => {
  const [selectedSlide, setSelectedSlide] = useState<Slide>();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isProjectFixturesOpen, setIsProjectFixturesOpen] = useState<boolean>();
  const [isSpacesSettingsOpen, setIsSpacesSettingsOpen] = useState<boolean>();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>();
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>();
  const [isReplaceSlideOpen, setIsReplaceSlideOpen] = useState<boolean>();

  // State to manage the selected slide for replacement
  const [replacementSlideUrl, setReplacementSlideUrl] = useState<string | null>(
    null
  );

  const { data: allSpaces, isLoading: allSpacesLoading } =
    useFetchSpacesByProject(projectData!._id!);

  const bulkSaveSlidesMutation = useBulkSaveSlides();
  const updateSlideMutation = useSaveSlide();
  const processSlidesInSpacesMutation = useProcessSpacesInSlides();
  const deleteSlideMutation = useDeleteSlide();

  const {
    data: slidesData,
    isPending: slidesDataPending,
    refetch: refetchSlidesData,
  } = useFetchSlidesByProject(projectData!._id!);

  useEffect(() => {
    if (!slidesData || !slidesData.length) {
      return;
    }

    const filterArchivedSlides = slidesData.filter(
      (slide: Slide) => !slide.archived
    );

    setSlides(filterArchivedSlides);
    setSelectedSlide(filterArchivedSlides[0]);
  }, [slidesData]);

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
    confirm({
      title: `Delete Design`,
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to delete this design?`,
      okText: `Delete`,
      okType: "danger",
      cancelButtonProps: {
        type: "default",
        shape: "default",
      },
      onOk: async () => {
        await deleteSlideMutation
          .mutateAsync(selectedSlide?._id as string)
          .catch((err) => {
            message.error("Something went wrong please try again later");
          })
          .then((data: Slide) => {
            if (data.archived) {
              message.success("Slide deleted successfully");
            }

            refetchSlidesData();
          });
      },
    });
  };

  const onClickReplace = (event: any) => {
    event.stopPropagation();
    setReplacementSlideUrl(null);
    setIsReplaceSlideOpen(true);
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
        processSlidesInSpacesMutation.mutate(
          { projectId: projectData!._id! },
          {
            onSuccess: async (response: any) => {
              refetchSlidesData();
            },
            onError: () => {},
          }
        );
        message.success("Designs saved successfully!");
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });
  };

  const renderSlideThumbnails = () => {
    let spaceDivider: string,
      toAddDivider = false;
    return slides

      .sort((s1: Slide, s2: Slide) =>
        (s2.spaces && s2.spaces.length ? s2.spaces[0] : "").localeCompare(
          s1.spaces && s1.spaces.length ? s1.spaces[0] : ""
        )
      )
      .map((slide) => {
        const slideSpace = allSpaces.find(
          (s: Space) =>
            s._id ==
            (slide.spaces && slide.spaces.length ? slide.spaces![0] : "")
        );
        if (slideSpace) {
          if (!spaceDivider || spaceDivider !== slideSpace.name) {
            spaceDivider = slideSpace.name;
            toAddDivider = true;
          } else {
            toAddDivider = false;
          }
        } else {
          toAddDivider = false;
        }

        return (
          <Flex
            style={{
              width: "100%",
            }}
          >
            <Flex vertical style={{ width: "100%" }}>
              {toAddDivider && (
                <Typography.Text
                  style={{
                    fontSize: "75%",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {spaceDivider.toUpperCase()}
                </Typography.Text>
              )}
              <div
                onClick={() => handleThumbnailClick(slide)}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: 85,
                  border:
                    slide._id == selectedSlide?._id
                      ? "4px solid"
                      : "0.5px solid",
                  borderColor:
                    slide._id == selectedSlide?._id
                      ? COLORS.primaryColor
                      : COLORS.borderColor,
                  borderRadius: 8,
                  backgroundImage: `url(${slide.url})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                }}
              ></div>
            </Flex>
          </Flex>
        );
      });
  };

  const handleReplaceSlide = async () => {
    if (selectedSlide) {
      const updateData = {
        ...selectedSlide,
        url: replacementSlideUrl ? replacementSlideUrl : selectedSlide.url,
      };

      await updateSlideMutation.mutateAsync(updateData, {
        onSuccess: async () => {
          message.success("Changes saved");
        },
        onError: () => {},
      });

      refetchSlidesData();
      setIsReplaceSlideOpen(false);
      setReplacementSlideUrl(null);
    }
  };

  if (slidesDataPending || allSpacesLoading) {
    return <>Loading...</>;
  }

  /**
   * When there are no slides added.
   */
  if (!slidesDataPending && (!slides || !slides.length)) {
    return (
      <Flex
        align="center"
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: 16,
          minHeight: 540,
          width: "100%",
        }}
      >
        <ImgsUpload
          confirmProcessing={true}
          imgsUploaded={imgsUploaded}
        ></ImgsUpload>
      </Flex>
    );
  }

  return (
    <Flex style={{ width: "100%" }} justify="center">
      <Flex
        vertical
        style={{
          width: "100%",
          maxWidth: 1300,
        }}
      >
        <Modal
          open={isReplaceSlideOpen}
          onOk={handleReplaceSlide}
          okText="Update"
          okButtonProps={{ disabled: !replacementSlideUrl }}
          confirmLoading={updateSlideMutation.isPending}
          title={
            <Typography.Title level={4} style={{ margin: 0 }}>
              Update Design
            </Typography.Title>
          }
          width={600}
          onCancel={() => {
            setIsReplaceSlideOpen(false);
          }}
        >
          {selectedSlide && (
            <Image
              style={{ width: "100%", margin: "auto", maxHeight: 400 }}
              preview={false}
              src={
                replacementSlideUrl ? replacementSlideUrl : selectedSlide.url
              }
            ></Image>
          )}
          <div style={{ marginTop: 20 }}>
            <ImgsUpload
              isMultiple={false}
              imgsUploaded={(imgs: string[]) => setReplacementSlideUrl(imgs[0])}
              confirmProcessing={false}
            ></ImgsUpload>
          </div>
        </Modal>

        <Modal
          open={isProjectFixturesOpen}
          footer={null}
          title={
            <Typography.Title level={4} style={{ margin: 0 }}>
              All Fixtures
            </Typography.Title>
          }
          width={600}
          onCancel={() => {
            setIsProjectFixturesOpen(false);
          }}
        >
          <ProjectFixtureDetails
            projectData={projectData}
            fixturesUpdated={fixturesUpdated}
          ></ProjectFixtureDetails>
        </Modal>

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
          <ProjectSettings
            projectData={projectData!}
            onProjectSaved={() => {
              setIsSettingsOpen(false);
            }}
          ></ProjectSettings>
        </Modal>
        <Modal
          footer={[]}
          width={1000}
          open={isPreviewOpen}
          onCancel={() => {
            setIsPreviewOpen(false);
          }}
        >
          <MobileFrame url={`${baseAppUrl}project/${projectData?._id}`} />
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
          {processSlidesInSpacesMutation.isPending && (
            <Tag icon={<SyncOutlined spin />} color="processing">
              Processing designs..
            </Tag>
          )}
          <Flex style={{ marginLeft: "auto" }}>
            {/* <Button
              style={{ color: COLORS.primaryColor }}
              type="link"
              onClick={() => {
                setIsProjectFixturesOpen(true);
              }}
              icon={<FormatPainterOutlined />}
            >
              Fixtures
            </Button> */}
            <Button
              style={{ color: COLORS.primaryColor }}
              type="link"
              onClick={() => {
                setIsPreviewOpen(true);
              }}
              icon={<ExpandOutlined />}
            >
              Preview
            </Button>
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
              width: 125,
              height: 540,
              overflowY: "scroll",
              flexWrap: "nowrap",
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
            gap={16}
          >
            {renderSlideThumbnails()}
            <ImgsUpload
              imgsUploaded={imgsUploaded}
              confirmProcessing={false}
            ></ImgsUpload>
          </Flex>
          <Flex
            justify="center"
            style={{
              width: "calc(100% - 440px)",
              height: 540,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 16,
              backgroundColor: COLORS.borderColorDark,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "relative",
            }}
          >
            <Image
              preview={false}
              src={selectedSlide!.url}
              height={540}
            ></Image>

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
                <Button
                  type="link"
                  onClick={onClickDelete}
                  icon={<DeleteOutlined />}
                  style={{
                    color: "white",
                    width: 24,
                    height: 24,
                    padding: 0,
                    marginRight: 8,
                  }}
                />
              </Tooltip>
              <Tooltip title="Click to replace">
                <Button
                  type="link"
                  onClick={onClickReplace}
                  icon={<UndoOutlined />}
                  style={{
                    color: "white",
                    width: 24,
                    height: 24,
                    padding: 0,
                    marginRight: 8,
                  }}
                />
              </Tooltip>
            </Flex>
          </Flex>
          <Flex vertical gap={16} style={{ width: 350 }}>
            <SlideSpaceMapping
              key="slide-spaces"
              onSpacesUpdated={spacesUpdated}
              projectId={projectData!._id!}
              slide={selectedSlide!}
              processingDesigns={processSlidesInSpacesMutation.isPending}
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
    </Flex>
  );
};

export default ProjectSlideDetails;

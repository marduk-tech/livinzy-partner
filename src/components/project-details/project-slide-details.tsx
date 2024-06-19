import React, { useEffect, useState } from "react";
import { Flex, Tooltip, message } from "antd";
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

const ProjectSlideDetails: React.FC<ProjectDetailsProps> = ({
  projectData,
}) => {
  const [selectedSlide, setSelectedSlide] = useState<Slide>();
  const [slides, setSlides] = useState<Slide[]>([]);
  const bulkSaveSlidesMutation = useBulkSaveSlides();
  const updateSlideMutation = useSaveSlide();

  const { data: slidesData, isPending: slidesDataPending } =
    useFetchSlidesByProject(projectData!._id!);

  useEffect(() => {
    if (!slidesData || !slidesData.length) {
      return;
    }
    setSlides(slidesData);
    setSelectedSlide(slidesData[0]);
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
        message.success("Slides saved successfully!");
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
    <Flex gap={32}>
      <Flex vertical>
        <div
          style={{
            width: 800,
            height: 600,
            borderRadius: 16,
            backgroundImage: `url(${selectedSlide!.url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <Flex
          gap={16}
          style={{
            marginTop: 16,
            width: 800,
            overflowX: "scroll",
            flexWrap: "nowrap",
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          {slides.map((slide) => (
            <Flex
              style={{
                width: 160,
                height: 120,
              }}
            >
              <Flex
                onClick={() => handleThumbnailClick(slide)}
                style={{
                  cursor: "pointer",
                  width: 160,
                  height: 120,
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
      </Flex>
      <Flex vertical>
        <SlideSpaceMapping
          key="slide-spaces"
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
  );
};

export default ProjectSlideDetails;

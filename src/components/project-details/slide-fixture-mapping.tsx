import { Button, Flex, Tooltip, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  useDeleteFixture,
  useFetchFixturesByProject,
  useSaveFixture,
} from "../../hooks/use-fixtures";
import { useFetchSlidesByProject, useSaveSlide } from "../../hooks/use-slides";
import { Fixture, FixtureFormData } from "../../interfaces/Fixture";
import { IBoundingBox, Slide } from "../../interfaces/Slide";

import { InfoCircleOutlined } from "@ant-design/icons";
import { queryKeys } from "../../libs/react-query/constants";
import { queryClient } from "../../libs/react-query/query-client";
import { COLORS } from "../../styles/colors";
import FixtureList from "../common/fixture-list";
import ImgMapFixture from "../common/img-map-fixture";
import FixtureDetails from "../fixture-details";
import { Loader } from "../loader";

interface FixtureMappingProps {
  projectId: string;
  slide?: Slide;
  onFixturesUpdated: any;
}

export function filterFixtures(
  projectFixtures: Fixture[],
  projectSlides: Slide[]
): Fixture[] {
  // Filter non-archived slides
  const nonArchivedSlides = projectSlides.filter((slide) => !slide.archived);

  // Extract all fixture IDs from non-archived slides
  const fixtureIds = new Set<string>();
  nonArchivedSlides.forEach((slide) => {
    slide.fixtures!.forEach((fixtureId) => {
      fixtureIds.add(fixtureId);
    });
  });

  // Filter projectFixtures to include only those present in fixtureIds
  const filteredProjectFixtures = projectFixtures.filter((fixture) =>
    fixtureIds.has(fixture._id!)
  );

  return filteredProjectFixtures;
}

const SlideFixtureMapping: React.FC<FixtureMappingProps> = ({
  projectId,
  slide,
  onFixturesUpdated,
}) => {
  const [fixtureModalVisible, setFixtureModalVisible] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [isMapFixtureOpen, setIsMapFixtureOpen] = useState<boolean>(false);
  const [mapFixtureImg, setMapFixtureImg] = useState<string>();
  const [slideFixtures, setSlideFixtures] = useState<Fixture[]>([]);

  const {
    data: projectFixtures,
    isPending: fixturesDataPending,
    refetch: refetchProjectFixtures,
  } = useFetchFixturesByProject(projectId);

  const { data: projectSlides, isPending: projectSlidesPending } =
    useFetchSlidesByProject(projectId);

  const updateSlideMutation = useSaveSlide();

  useEffect(() => {
    if (
      !projectFixtures ||
      !projectFixtures.length ||
      !projectSlides ||
      !projectSlides.length
    ) {
      return;
    }

    if (slide) {
      setSlideFixtures(
        projectFixtures.filter((f: Fixture) => slide.fixtures?.includes(f._id!))
      );
    } else {
      setSlideFixtures(filterFixtures(projectFixtures, projectSlides));
    }
  }, [projectFixtures, slide, projectSlides, refetchProjectFixtures]);

  const saveFixtureMutation = useSaveFixture();
  const deleteFixtureMutation = useDeleteFixture();

  const handleBoundingBoxComplete = async (data: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    imageSize: { width: number; height: number };
  }) => {
    const updatedFixturesMapping =
      slide?.fixturesMapping?.map((item) => {
        if (item.fixtureId === editingFixture!._id!) {
          return {
            ...item,
            boundingBox: {
              startPoint: data.startPoint,
              endPoint: data.endPoint,
              imageSize: data.imageSize,
            },
          };
        }
        return item;
      }) || [];

    // Check if the fixtureId exists in the fixturesMapping array
    const fixtureExists = updatedFixturesMapping.some(
      (item) => item.fixtureId === editingFixture!._id!
    );

    // If the fixtureId does not exist, add the new fixture object
    if (!fixtureExists) {
      updatedFixturesMapping.push({
        fixtureId: editingFixture!._id!,
        boundingBox: {
          startPoint: data.startPoint,
          endPoint: data.endPoint,
          imageSize: data.imageSize,
        },
      });
    }
    slide!.fixturesMapping = updatedFixturesMapping;

    await updateSlideMutation.mutateAsync(
      {
        _id: slide?._id,
        fixturesMapping: updatedFixturesMapping,
      },
      {
        onSuccess: () => {
          message.success("Mapping updated");
          refetchProjectFixtures();
        },
        onError: () => {
          message.error("Failed to save mapping. Try again.");
        },
      }
    );

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getSlides, projectId],
    });

    setIsMapFixtureOpen(false);
  };

  const onDeleteFixture = (fixtureData: Fixture) => {
    deleteFixtureMutation.mutate(fixtureData._id!, {
      onSuccess: async () => {
        if (slide) {
          const index = slide.fixtures!.indexOf(fixtureData._id!);

          if (index > -1) {
            slide.fixtures!.splice(index, 1);
            onFixturesUpdated(slide, fixtureData._id!);
          }
        }

        refetchProjectFixtures();
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });
  };

  const onSaveFixture = (fixtureData: FixtureFormData) => {
    fixtureData.projectId = projectId;
    fixtureData._id = fixtureData._id || editingFixture?._id;

    saveFixtureMutation.mutate(fixtureData, {
      onSuccess: (response: any) => {
        if (slide) {
          slide.fixtures = slide.fixtures || [];
          if (!slide.fixtures.includes(response._id)) {
            slide.fixtures.push(response._id);
          }
          if (!editingFixture) {
            onFixturesUpdated(slide);
          } else {
            message.success("Changed saved");
          }
        }

        refetchProjectFixtures();
      },
      onError: (err) => {
        message.error("Failed to save project.");
      },
    });

    setFixtureModalVisible(false);
    setEditingFixture(null);
  };

  //  get initial bounding box
  const getInitialBoundingBox = (): IBoundingBox | undefined => {
    if (projectSlides && slide?._id && editingFixture?._id) {
      const currentSlide = projectSlides.find(
        (item: any) => item._id === slide._id
      );

      if (currentSlide?.fixturesMapping) {
        const fixture = currentSlide.fixturesMapping.find(
          (item: any) => item.fixtureId === editingFixture._id
        );
        return fixture ? fixture.boundingBox : undefined;
      }
    }

    return undefined;
  };

  if (fixturesDataPending || projectSlidesPending) {
    return <Loader />;
  }

  if (projectFixtures && projectSlides) {
    const initBoundingBox = getInitialBoundingBox();

    return (
      <Flex
        style={{
          minWidth: "100%",
          height: 449,
          overflowY: "scroll",
        }}
        vertical
      >
        <ImgMapFixture
          modalClosed={() => {
            setIsMapFixtureOpen(false);
          }}
          imageUrl={mapFixtureImg!}
          isOpen={!!isMapFixtureOpen}
          initialBoundingBox={initBoundingBox}
          onBoundingBoxComplete={handleBoundingBoxComplete}
        />

        {slide && (
          <Flex align="center" style={{ marginTop: 8 }}>
            <Flex align="center" gap={4} style={{ cursor: "pointer" }}>
              <Typography.Title level={4} style={{ marginTop: 0, margin: 0 }}>
                Fixtures
              </Typography.Title>
              <Tooltip title="Add fixtures in this design">
                <InfoCircleOutlined></InfoCircleOutlined>
              </Tooltip>
            </Flex>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setEditingFixture(null);
                setFixtureModalVisible(true);
              }}
              style={{
                color: COLORS.primaryColor,
                cursor: "pointer",
                textAlign: "center",
                width: 100,
                padding: 0,
                marginLeft: "auto",
              }}
            >
              Add Fixture
            </Button>
          </Flex>
        )}

        <div style={{ marginTop: slide ? 0 : 10 }}>
          <FixtureList
            isModal={slide ? false : true}
            fixtures={slideFixtures}
            isPending={fixturesDataPending}
            onMap={(fixture) => {
              setEditingFixture(fixture);
              setMapFixtureImg(slide?.url);
              setIsMapFixtureOpen(true);
            }}
            onEdit={(fixture) => {
              setEditingFixture(fixture);
              setFixtureModalVisible(true);
            }}
            onDelete={onDeleteFixture}
          />
        </div>

        <FixtureDetails
          isOpen={fixtureModalVisible}
          fixture={editingFixture}
          slide={slide}
          onSubmit={onSaveFixture}
          onCancel={() => {
            setFixtureModalVisible(false);
            setEditingFixture(null);
          }}
        />
      </Flex>
    );
  }
};

export default SlideFixtureMapping;

import React, { useEffect, useState } from "react";
import { Button, List, Typography, message, Flex, Popconfirm, Tag } from "antd";
import FixtureDetails from "../fixture-details";
import {
  useDeleteFixture,
  useFetchFixturesByProject,
  useSaveFixture,
} from "../../hooks/use-fixtures";
import { COLORS } from "../../styles/colors";
import { Slide } from "../../interfaces/Slide";
import {
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  BorderOuterOutlined,
} from "@ant-design/icons";
import { Fixture, FixtureFormData } from "../../interfaces/Fixture";
import ImgMapFixture from "../common/img-map-fixture";

interface SlideFixtureMappingProps {
  projectId: string;
  slide: Slide;
  onFixturesUpdated: any;
}

const SlideFixtureMapping: React.FC<SlideFixtureMappingProps> = ({
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

  useEffect(() => {
    if (!projectFixtures || !projectFixtures.length) {
      return;
    }
    setSlideFixtures(
      projectFixtures.filter((f: Fixture) => slide.fixtures?.includes(f._id!))
    );
  }, [projectFixtures, slide]);

  const saveFixtureMutation = useSaveFixture();
  const deleteFixtureMutation = useDeleteFixture();

  const handleBoundingBoxComplete = (data: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    imageSize: { width: number; height: number };
  }) => {
    setIsMapFixtureOpen(false);
    saveFixtureMutation.mutate(
      {
        ...editingFixture,
        imageBounds: data,
        fixtureType: editingFixture!.fixtureType!._id,
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
  };

  const onDeleteFixture = (fixtureData: Fixture) => {
    deleteFixtureMutation.mutate(fixtureData._id!, {
      onSuccess: () => {
        const index = slide.fixtures!.indexOf(fixtureData._id!);
        if (index > -1) {
          slide.fixtures!.splice(index, 1);
          onFixturesUpdated(slide.fixtures);
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
    fixtureData._id = editingFixture?._id;
    saveFixtureMutation.mutate(fixtureData, {
      onSuccess: (response: any) => {
        slide.fixtures = slide.fixtures || [];
        slide.fixtures.push(response._id);
        if (!editingFixture) {
          onFixturesUpdated(slide.fixtures);
        } else {
          message.success("Changed saved");
        }
        refetchProjectFixtures();
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });

    setFixtureModalVisible(false);
    setEditingFixture(null);
  };

  if (fixturesDataPending) {
    return <>Loading..</>;
  }

  return (
    <Flex
      style={{
        marginTop: 16,
        padding: 16,
        minWidth: 250,
        borderRadius: 16,
        border: "1px solid",
        borderColor: COLORS.borderColor,
      }}
      vertical
    >
      <ImgMapFixture
        modalClosed={() => {
          setIsMapFixtureOpen(false);
        }}
        imageUrl={mapFixtureImg!}
        isOpen={!!isMapFixtureOpen}
        initialBoundingBox={
          editingFixture && editingFixture.imageBounds
            ? editingFixture.imageBounds
            : undefined
        }
        onBoundingBoxComplete={handleBoundingBoxComplete}
      />
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Fixtures
      </Typography.Title>
      <Typography.Text
        style={{
          marginTop: -8,
          fontSize: 12,
          marginBottom: 32,
          color: COLORS.textColorLight,
        }}
      >
        Highlight fixtures in this design.
      </Typography.Text>
      {slideFixtures && slideFixtures.length ? (
        <List
          style={{ width: 250 }}
          dataSource={slideFixtures}
          renderItem={(fixture: Fixture, index: number) => (
            <Flex
              vertical
              style={{
                paddingBottom: 16,
                marginBottom: 16,
                borderBottom: "1px dashed",
                borderBottomColor: COLORS.borderColor,
              }}
            >
              <Flex justify="flex-start">
                <Typography.Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 14,
                    backgroundColor: COLORS.textColorDark,
                    height: 20,
                    width: 20,
                    marginTop: 4,
                    borderRadius: "50%",
                    lineHeight: "140%",
                    marginRight: 8,
                  }}
                >
                  {index + 1}
                </Typography.Text>

                <Flex vertical>
                  <Typography.Text style={{ fontSize: 16, marginBottom: 8 }}>
                    {fixture!.fixtureType!.fixtureType}
                  </Typography.Text>
                  <Flex>
                    <Button
                      type="link"
                      disabled={fixturesDataPending}
                      style={{
                        cursor: "pointer",
                        padding: 0,
                        marginRight: 16,
                        height: 32,
                        color: COLORS.primaryColor,
                      }}
                      icon={<BorderOuterOutlined />}
                      onClick={() => {
                        setEditingFixture(fixture);
                        setMapFixtureImg(slide.url);
                        setIsMapFixtureOpen(true);
                      }}
                    >
                      Map
                    </Button>
                    <Button
                      type="link"
                      disabled={fixturesDataPending}
                      style={{
                        cursor: "pointer",
                        padding: 0,
                        marginRight: 16,
                        height: 32,
                        color: COLORS.primaryColor,
                      }}
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingFixture(fixture);
                        setFixtureModalVisible(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure to delete this ?"
                      disabled={fixturesDataPending}
                      onConfirm={() => {
                        onDeleteFixture(fixture);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        style={{
                          padding: 0,
                          height: 32,
                          color: COLORS.primaryColor,
                        }}
                        type="link"
                        icon={<DeleteOutlined />}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )}
        />
      ) : (
        <Tag style={{ padding: 8 }} icon={<InfoCircleOutlined />}>
          No fixtures mapped
        </Tag>
      )}

      <Button
        type="primary"
        size="small"
        onClick={() => {
          setEditingFixture(null);
          setFixtureModalVisible(true);
        }}
        style={{
          cursor: "pointer",
          marginBottom: 16,
          textAlign: "center",
          padding: 0,
          marginTop: 32,
          width: 100,
        }}
      >
        Add Fixture
      </Button>

      <FixtureDetails
        isOpen={fixtureModalVisible}
        fixture={editingFixture}
        onSubmit={onSaveFixture}
        onCancel={() => {
          setFixtureModalVisible(false);
          setEditingFixture(null);
        }}
      />
    </Flex>
  );
};

export default SlideFixtureMapping;

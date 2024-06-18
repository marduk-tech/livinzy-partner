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
} from "@ant-design/icons";
import { Fixture } from "../../interfaces/Fixture";

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

  const onSaveFixture = (fixtureData: Fixture) => {
    fixtureData.projectId = projectId;
    saveFixtureMutation.mutate(
      editingFixture ? { ...editingFixture, ...fixtureData } : fixtureData,
      {
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
      }
    );

    setFixtureModalVisible(false);
    setEditingFixture(null);
  };

  if (fixturesDataPending) {
    return <>Loading..</>;
  }

  return (
    <Flex style={{ marginTop: 32 }} vertical>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        Fixtures
      </Typography.Title>
      {slideFixtures && slideFixtures.length ? (
        <List
          bordered
          style={{ width: 400 }}
          dataSource={slideFixtures}
          renderItem={(fixture: Fixture) => (
            <Flex style={{ padding: 16 }} align="center">
              <Typography.Text>
                {fixture.fixtureType.fixtureType}
              </Typography.Text>
              <Flex style={{ marginLeft: "auto" }}>
                <Button
                  type="link"
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
          )}
        />
      ) : (
        <Tag style={{ padding: 8 }} icon={<InfoCircleOutlined />}>
          No fixtures mapped
        </Tag>
      )}

      <Button
        type="link"
        onClick={() => {
          setEditingFixture(null);
          setFixtureModalVisible(true);
        }}
        style={{
          cursor: "pointer",
          marginBottom: 16,
          textAlign: "left",
          color: COLORS.primaryColor,
          padding: 0,
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

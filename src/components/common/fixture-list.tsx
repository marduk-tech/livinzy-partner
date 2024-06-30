import {
  BorderOuterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Flex, List, Popconfirm, Tag, Typography } from "antd";
import { useEffect } from "react";
import { useFetchFixturesByProject } from "../../hooks/use-fixtures";
import { Fixture } from "../../interfaces/Fixture";
import { Slide } from "../../interfaces/Slide";
import { COLORS } from "../../styles/colors";
import { Loader } from "../loader";

interface IFixtureList {
  projectId: string;
  slide?: Slide;
  fixturesUpdated: any;
}

const FixtureList: React.FC<IFixtureList> = ({
  projectId,
  slide,
  fixturesUpdated,
}) => {
  const {
    data: projectFixtures,
    isPending: fixturesDataPending,
    refetch: refetchProjectFixtures,
  } = useFetchFixturesByProject(projectId);

  //   useEffect(() => {
  //     if (!projectFixtures || !projectFixtures.length) {
  //       return;
  //     }

  //     setSlideFixtures(
  //       projectFixtures.filter((f: Fixture) => slide.fixtures?.includes(f._id!))
  //     );
  //   }, [projectFixtures, slide]);

  if (fixturesDataPending) {
    return <Loader />;
  }

  return (
    <>
      {projectFixtures && projectFixtures.length ? (
        <List
          style={{ width: 350 }}
          dataSource={projectFixtures}
          renderItem={(fixture: Fixture, index: number) => (
            <Flex
              vertical
              style={{
                padding: 16,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: "white",
                border: "1px solid",
                borderColor: COLORS.borderColor,
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
    </>
  );
};

export default FixtureList;

import {
  BorderOuterOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Flex, List, Popconfirm, Tag, Tooltip, Typography } from "antd";
import React from "react";
import { Fixture } from "../../interfaces/Fixture";
import { COLORS } from "../../styles/colors";

interface FixtureListProps {
  fixtures: Fixture[];
  onMap: (fixture: Fixture) => void;
  onEdit: (fixture: Fixture) => void;
  onDelete: (fixture: Fixture) => void;
  onHighlight: (fixture: Fixture) => void;
  highlightedFixtures: string[];
  isPending: boolean;
  isAllFixturesModal: boolean;
}

/**
 * Component for rendering a list of fixtures
 * @param fixtures Array of fixtures to display
 * @param onMap Function to call when mapping a fixture
 * @param onEdit Function to call when editing a fixture
 * @param onDelete Function to call when deleting a fixture
 * @param onHighlight Function to call when highlighting a fixture
 * @param highlightedFixtures Array of highlighted fixture IDs
 * @param isPending Boolean to indicate if actions are pending
 * @param isAllFixturesModal Boolean to indicate if this is in the all fixtures modal
 */
const FixtureList: React.FC<FixtureListProps> = ({
  fixtures,
  onMap,
  onEdit,
  onDelete,
  isPending,
  isAllFixturesModal = false,
  onHighlight,
  highlightedFixtures,
}) => {
  if (!fixtures.length) {
    return (
      <Tag style={{ padding: 8, width: "100%" }} icon={<InfoCircleOutlined />}>
        No fixtures mapped
      </Tag>
    );
  }

  return (
    <List
      style={{ width: "100%" }}
      dataSource={fixtures}
      renderItem={(fixture: Fixture, index: number) => {
        const isFixtureHighlighted = highlightedFixtures.some(
          (item) => item === fixture._id
        )
          ? true
          : false;

        const handleHighlight = () => {
          onHighlight(fixture);
          // prevent popoconfirm instant label update which causes flicker
          setTimeout(() => {}, 500); // 500ms delay
        };

        return (
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
                <Typography.Text style={{ fontSize: 16 }}>
                  {fixture.designName ||
                    (!!fixture.fixtureType
                      ? fixture!.fixtureType!.fixtureType
                      : "")}
                </Typography.Text>
                <Typography.Text
                  style={{
                    color: COLORS.textColorLight,
                    marginBottom: 8,
                    fontSize: 12,
                  }}
                >
                  {!!fixture.fixtureType
                    ? fixture!.fixtureType!.fixtureType
                    : ""}
                </Typography.Text>
                <Flex gap={16}>
                  {!isAllFixturesModal && (
                    <Tooltip title="Locate this fixture in slide">
                      <Button
                        type="link"
                        disabled={isPending}
                        style={{
                          cursor: "pointer",
                          padding: 0,
                          height: 32,
                          width: 24,
                          color: COLORS.primaryColor,
                        }}
                        icon={<BorderOuterOutlined />}
                        onClick={() => onMap(fixture)}
                      ></Button>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit fixture">
                    <Button
                      type="link"
                      disabled={isPending}
                      style={{
                        cursor: "pointer",
                        padding: 0,
                        height: 32,
                        width: 24,
                        color: COLORS.primaryColor,
                      }}
                      icon={<EditOutlined />}
                      onClick={() => onEdit(fixture)}
                    ></Button>
                  </Tooltip>

                  <Popconfirm
                    title={
                      isFixtureHighlighted
                        ? "Are you sure you want to remove this as a project highlight?"
                        : "Are you sure you want to highlight this fixture?"
                    }
                    disabled={isPending}
                    onConfirm={handleHighlight}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Highlight fixture">
                      <Button
                        type="link"
                        disabled={isPending}
                        style={{
                          cursor: "pointer",
                          padding: 0,
                          height: 32,
                          width: 24,
                          color: COLORS.primaryColor,
                        }}
                        icon={
                          isFixtureHighlighted ? (
                            <StarFilled />
                          ) : (
                            <StarOutlined />
                          )
                        }
                      ></Button>
                    </Tooltip>
                  </Popconfirm>
                  {!isAllFixturesModal && (
                    <Popconfirm
                      title="Are you sure to delete this ?"
                      disabled={isPending}
                      onConfirm={() => onDelete(fixture)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Delete fixture">
                        <Button
                          style={{
                            padding: 0,
                            width: 24,
                            height: 32,
                            color: COLORS.redIdentifier,
                          }}
                          type="link"
                          icon={<DeleteOutlined />}
                        ></Button>
                      </Tooltip>
                    </Popconfirm>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        );
      }}
    />
  );
};

export default FixtureList;

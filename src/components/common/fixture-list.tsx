import {
  BorderOuterOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
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
  isPending: boolean;
  isAllFixturesModal: boolean;
}

const FixtureList: React.FC<FixtureListProps> = ({
  fixtures,
  onMap,
  onEdit,
  onDelete,
  isPending,
  isAllFixturesModal = false,
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
                {!!fixture.fixtureType ? fixture!.fixtureType!.fixtureType : ""}
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
      )}
    />
  );
};

export default FixtureList;

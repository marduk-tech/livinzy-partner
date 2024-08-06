import {
  BorderOuterOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Flex, List, Popconfirm, Tag, Typography } from "antd";
import React from "react";
import { Fixture } from "../../interfaces/Fixture";
import { COLORS } from "../../styles/colors";

interface FixtureListProps {
  fixtures: Fixture[];
  onMap: (fixture: Fixture) => void;
  onEdit: (fixture: Fixture) => void;
  onDelete: (fixture: Fixture) => void;
  isPending: boolean;
  isModal: boolean;
}

const FixtureList: React.FC<FixtureListProps> = ({
  fixtures,
  onMap,
  onEdit,
  onDelete,
  isPending,
  isModal = false,
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
              <Flex>
                {!isModal && (
                  <Button
                    type="link"
                    disabled={isPending}
                    style={{
                      cursor: "pointer",
                      padding: 0,
                      marginRight: 16,
                      height: 32,
                      color: COLORS.primaryColor,
                    }}
                    icon={<BorderOuterOutlined />}
                    onClick={() => onMap(fixture)}
                  >
                    Map
                  </Button>
                )}

                <Button
                  type="link"
                  disabled={isPending}
                  style={{
                    cursor: "pointer",
                    padding: 0,
                    marginRight: 16,
                    height: 32,
                    color: COLORS.primaryColor,
                  }}
                  icon={<EditOutlined />}
                  onClick={() => onEdit(fixture)}
                >
                  Edit
                </Button>

                {!isModal && (
                  <Popconfirm
                    title="Are you sure to delete this ?"
                    disabled={isPending}
                    onConfirm={() => onDelete(fixture)}
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

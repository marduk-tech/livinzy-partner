import React, { useEffect, useState } from "react";
import { Button, Flex, Image, Select, Tooltip, Typography } from "antd";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { Slide } from "../../interfaces/Slide";
import { COLORS } from "../../styles/colors";
import "../../styles/override.scss";
import { Space } from "../../interfaces/Space";
import { InfoCircleOutlined, SettingFilled } from "@ant-design/icons";
import SpaceDetails from "../space-details";
import { convertInchToFeet } from "../../libs/lvnzy-helper";

interface SlideSpaceMappingProps {
  projectId: string;
  slide: Slide;
  onSpacesUpdated: any;
  processingDesigns: boolean;
}

const SlideSpaceMapping: React.FC<SlideSpaceMappingProps> = ({
  projectId,
  slide,
  onSpacesUpdated,
  processingDesigns,
}) => {
  const [selectedSpace, setSelectedSpace] = useState<string>(
    slide.spaces && slide.spaces.length ? slide.spaces[0] : ""
  );
  const [spaceDialogOpen, setSpaceDialogOpen] = useState(false);

  const [formattedSpaces, setFormattedSpaces] = useState<Space[]>([]);

  const {
    data: projectSpaces,
    isPending: projectSpacesPending,
    refetch: refetchSpaces,
  } = useFetchSpacesByProject(projectId!);

  useEffect(() => {
    refetchSpaces();
    setSelectedSpace(
      slide.spaces && slide.spaces.length ? slide.spaces[0] : ""
    );
  }, [slide]);

  useEffect(() => {
    if (projectSpaces && projectSpaces.length) {
      setFormattedSpaces(
        projectSpaces.map((s: Space) => {
          return {
            ...s,
            size:
              s.size && s.size.l
                ? {
                    l: convertInchToFeet(s.size.l),
                    w: convertInchToFeet(s.size.w),
                  }
                : undefined,
          };
        })
      );
    }
  }, [projectSpaces]);

  const handleSpacesChange = (value: string) => {
    setSelectedSpace(value);
    onSpacesUpdated([value]);
  };

  if (projectSpacesPending) {
    return <>Loading..</>;
  }

  return (
    <Flex
      vertical
      style={{
        width: "100%",
        borderColor: COLORS.borderColor,
      }}
    >
      <Flex align="center" gap={4} style={{ cursor: "pointer" }}>
        <Typography.Title level={4} style={{ marginTop: 0, margin: 0 }}>
          Space
        </Typography.Title>
        <Tooltip title="Select the space in this design">
          <InfoCircleOutlined></InfoCircleOutlined>
        </Tooltip>
      </Flex>

      <Flex gap={8} style={{ width: "100%" }}>
        <Select
          size="large"
          disabled={processingDesigns}
          value={selectedSpace}
          placeholder="Select spaces/rooms in this design"
          onChange={handleSpacesChange}
          style={{
            width: "calc(100% - 68px)",
            height: 60,
          }}
          options={formattedSpaces!.map((space: Space) => {
            return {
              value: space._id,
              label: (
                <Flex align="center" gap={16}>
                  <Image
                    width={32}
                    src={space.spaceType.icon || "../../app/gen-room.png"}
                    style={{ marginRight: 16 }}
                    preview={false}
                  ></Image>
                  <Flex vertical>
                    <Typography.Text style={{ fontSize: 18 }}>
                      {space.name}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        color: COLORS.textColorLight,
                        marginTop: -4,
                      }}
                    >
                      ₹{space.cost || "??"}
                      {space.size
                        ? ` | ${space.size.l + 0}x${space.size.w} ft`
                        : ""}
                    </Typography.Text>
                  </Flex>
                </Flex>
              ),
            };
          })}
        ></Select>
        <Button
          style={{ height: 60, width: 60, padding: 0 }}
          onClick={() => {
            setSpaceDialogOpen(true);
          }}
          icon={<SettingFilled></SettingFilled>}
        ></Button>
        <SpaceDetails
          spaceDialogClosed={() => {
            setSpaceDialogOpen(false);
          }}
          spaceData={
            formattedSpaces.find((ps: Space) => selectedSpace == ps._id!)!
          }
          projectId={projectId}
          showSpaceDialog={spaceDialogOpen}
        ></SpaceDetails>
      </Flex>
    </Flex>
  );
};

export default SlideSpaceMapping;

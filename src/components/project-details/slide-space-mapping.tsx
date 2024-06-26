import React, { useEffect, useState } from "react";
import { Flex, Image, Select, Spin, Typography } from "antd";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { COLORS } from "../../styles/colors";
import "../../styles/override.scss";

interface SlideSpaceMappingProps {
  projectId: string;
  slide: Slide;
  onSpacesUpdated: any;
  isProcessing: boolean;
}

const SlideSpaceMapping: React.FC<SlideSpaceMappingProps> = ({
  projectId,
  slide,
  isProcessing,
  onSpacesUpdated,
}) => {
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(
    slide.spaces || []
  );

  const {
    data: projectSpaces,
    isPending: projectSpacesPending,
    refetch: refetchSpaces,
  } = useFetchSpacesByProject(projectId!);

  useEffect(() => {
    refetchSpaces();
    setSelectedSpaces(slide.spaces || []);
  }, [slide, isProcessing]);

  const handleSpacesChange = (value: string[]) => {
    setSelectedSpaces(value);
    onSpacesUpdated(value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => {
    debugger;
    const optionOriginalSpace = projectSpaces.find(
      (ps: Space) => ps._id == option!.value
    );
    const containsKeyword =
      (optionOriginalSpace.spaceType.spaceType ?? "")
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      (optionOriginalSpace.name ?? "")
        .toLowerCase()
        .includes(input.toLowerCase());
    return containsKeyword;
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
      {/* <Typography.Title level={4} style={{ marginTop: 0 }}>
        Spaces
      </Typography.Title> */}
      {isProcessing ? (
        <Flex style={{ height: 64 }} gap={16} align="center">
          <Spin></Spin>
          <Typography.Text style={{ color: COLORS.textColorLight }}>
            Loading Spaces..
          </Typography.Text>
        </Flex>
      ) : (
        <Select
          showSearch
          size="large"
          allowClear
          loading={isProcessing}
          value={selectedSpaces}
          placeholder="Select spaces/rooms in this design"
          onChange={handleSpacesChange}
          style={{
            width: "100%",
            height: 75,
          }}
          filterOption={filterOption}
          options={projectSpaces!.map((space: Space) => {
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
                  <Typography.Text style={{ fontSize: 18 }}>
                    {space.name}
                  </Typography.Text>
                </Flex>
              ),
            };
          })}
        ></Select>
      )}
    </Flex>
  );
};

export default SlideSpaceMapping;

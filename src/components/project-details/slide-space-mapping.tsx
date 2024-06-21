import React, { useEffect, useState } from "react";
import { Flex, Select, Typography } from "antd";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { COLORS } from "../../styles/colors";

interface SlideSpaceMappingProps {
  projectId: string;
  slide: Slide;
  onSpacesUpdated: any;
}

// Filter `option.label` match the user type `input`
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const SlideSpaceMapping: React.FC<SlideSpaceMappingProps> = ({
  projectId,
  slide,
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
  }, [slide]);

  const handleSpacesChange = (value: string[]) => {
    setSelectedSpaces(value);
    onSpacesUpdated(value);
  };

  if (projectSpacesPending) {
    return <>Loading..</>;
  }

  return (
    <Flex
      vertical
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid",
        borderColor: COLORS.borderColor,
      }}
    >
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Spaces
      </Typography.Title>
      <Typography.Text
        style={{
          marginTop: -8,
          fontSize: 12,
          marginBottom: 16,
          color: COLORS.textColorLight,
        }}
      >
        Map to spaces in this image.
      </Typography.Text>
      <Select
        showSearch
        mode="multiple"
        allowClear
        value={selectedSpaces}
        placeholder="Select spaces"
        onChange={handleSpacesChange}
        style={{
          width: 250,
          fontSize: 14,
        }}
        filterOption={filterOption}
        options={projectSpaces!.map((space: Space) => {
          return {
            value: space._id!,
            label: `${space.name}`,
          };
        })}
      ></Select>
    </Flex>
  );
};

export default SlideSpaceMapping;

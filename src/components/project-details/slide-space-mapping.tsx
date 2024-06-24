import React, { useEffect, useState } from "react";
import { Flex, Select, Spin } from "antd";
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

// Filter `option.label` match the user type `input`
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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

  if (projectSpacesPending) {
    return <>Loading..</>;
  }

  return (
    <Flex
      vertical
      style={{
        minWidth: 250,
        borderColor: COLORS.borderColor,
      }}
    >
      {/* <Typography.Title level={4} style={{ marginTop: 0 }}>
        Spaces
      </Typography.Title> */}
      {isProcessing ? (
        <Spin size="small" style={{ width: 250 }}>
          Loading spaces..
        </Spin>
      ) : (
        <Select
          showSearch
          mode="multiple"
          allowClear
          className="custom-select"
          loading={isProcessing}
          value={selectedSpaces}
          placeholder="Select spaces in this picture"
          onChange={handleSpacesChange}
          style={{
            width: 282,
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
      )}
    </Flex>
  );
};

export default SlideSpaceMapping;

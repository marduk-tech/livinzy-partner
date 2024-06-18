import React, { useEffect, useState } from "react";
import { Select, Typography } from "antd";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { useSaveSlide } from "../../hooks/use-slides";


interface SlideSpaceMappingProps {
  projectId: string;
  slide: Slide;
  onSpacesUpdated: any
}

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const SlideSpaceMapping: React.FC<SlideSpaceMappingProps> = ({
  projectId,
  slide,
  onSpacesUpdated
}) => {
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(slide.spaces || []);

  const { data: projectSpaces, isPending: projectSpacesPending, refetch: refetchSpaces } = useFetchSpacesByProject(projectId!);

  useEffect(() => {
    refetchSpaces();
    setSelectedSpaces(slide.spaces || []);
  }, [slide]);

  const handleSpacesChange = (value: string[]) => {
    setSelectedSpaces(value);
    onSpacesUpdated(value);
  };

  if (projectSpacesPending) {
    return  <>Loading..</>
  }

  return (
    <>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        Spaces
      </Typography.Title>
          <Select
            showSearch
            mode="multiple"
            allowClear
            value={selectedSpaces}
            placeholder="Select spaces"
            onChange={handleSpacesChange}
            style={{ width: 400 }}
            filterOption={filterOption}
            options={projectSpaces!.map((space: Space) => {
              return { value: space._id!, label: `${space.name} (${space.spaceType.spaceType})` };
            })}
          ></Select>
    </>
  );
};

export default SlideSpaceMapping;

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Flex,
  Form,
  Image,
  message,
  Spin,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useFetchFixturesByProject } from "../../hooks/use-fixtures";
import { getSpaceMeta } from "../../hooks/use-meta";
import {
  useDeleteSpace,
  useFetchSpacesByProject,
  useSaveSpace,
} from "../../hooks/use-spaces";
import { SpaceMeta } from "../../interfaces/Meta";
import { ProjectDetailsProps } from "../../interfaces/Project";
import { Space } from "../../interfaces/Space";
import { convertInchToFeet } from "../../libs/lvnzy-helper";
import { queryKeys } from "../../libs/react-query/constants";
import { queryClient } from "../../libs/react-query/query-client";
import { COLORS } from "../../styles/colors";
import FixtureList from "../common/fixture-list";
import { Loader } from "../loader";
import SpaceDetails from "../space-details";
import SlideFixtureMapping from "./slide-fixture-mapping";

const ProjectFixtureDetails: React.FC<any> = ({
  projectData,
  fixturesUpdated,
}) => {
  return (
    <>
      <FixtureList
        projectId={projectData?._id as string}
        fixturesUpdated={fixturesUpdated}
      />
    </>
  );
};

export default ProjectFixtureDetails;

import { message } from "antd";
import React from "react";
import { useSaveSlide } from "../../hooks/use-slides";
import { Slide } from "../../interfaces/Slide";
import { queryKeys } from "../../libs/react-query/constants";
import { queryClient } from "../../libs/react-query/query-client";
import FixtureMapping from "./slide-fixture-mapping";

/**
 * Component for managing project fixture details
 * @param projectData The data of the current project
 */
const ProjectFixtureDetails: React.FC<any> = ({ projectData }) => {
  const updateSlideMutation = useSaveSlide();

  /**
   * Handles the update of fixtures for a slide
   * @param slide The slide with updated fixtures
   */
  const fixturesUpdated = (slide: Slide) => {
    updateSlideMutation.mutate(slide!, {
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.getSlides, projectData._id],
        });
        message.success("Changes saved");
      },
      onError: () => {},
    });
  };

  return (
    <FixtureMapping
      onFixturesUpdated={fixturesUpdated}
      projectId={projectData._id}
    />
  );
};

export default ProjectFixtureDetails;

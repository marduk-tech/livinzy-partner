import { message } from "antd";
import React from "react";
import { useSaveSlide } from "../../hooks/use-slides";
import { Slide } from "../../interfaces/Slide";
import FixtureMapping from "./slide-fixture-mapping";

const ProjectFixtureDetails: React.FC<any> = ({ projectData }) => {
  const updateSlideMutation = useSaveSlide();

  const fixturesUpdated = (slide: Slide) => {
    updateSlideMutation.mutate(slide!, {
      onSuccess: async () => {
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

import React, { useEffect, useState } from "react";
import { Button, Flex, message, StepProps, Steps, theme, Typography } from "antd";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import ProjectBasicDetails from "./project-basic-details";
import ProjectSpaceDetails from "./project-space-details";
import ProjectSlideDetails from "./project-slide-details";
import { COLORS } from "../../styles/colors";

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectData }) => {
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<StepProps[]>([]);
  const [currentProject, setCurrentProject] = useState<Project|undefined>(projectData);

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  useEffect(()=> {

    setSteps([
      {
        title: "Basic Info",
      },
      {
        title: "Spaces",
        disabled: !currentProject || !currentProject._id
      },
      {
        title: "Designs",
        disabled: !currentProject || !currentProject._id
      },
    ])

  }, [currentProject])

  const basicDetailsUpdated = (project: Project) => {
    setCurrentProject(project);
  }

  const renderContent = () => {
    switch (current) {
      case 0:
        return <ProjectBasicDetails projectData={currentProject}  basicDetailsUpdated={basicDetailsUpdated}/>;
      case 1:
        return (
          <ProjectSpaceDetails projectData={currentProject}></ProjectSpaceDetails>
        );
      case 2:
        return (
          <ProjectSlideDetails projectData={currentProject}></ProjectSlideDetails>
        );
    }
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  return (
    <Flex
      style={{ backgroundColor: "white", padding: 32, borderRadius: 8 }}
      align="left"
    >
      <Flex vertical style={{borderRight: "1px solid", borderRightColor: COLORS.borderColor, marginRight: 64}}>
        <Typography.Title level={3} style={{ margin: 0, marginBottom: 48 }}>
          {projectData ? projectData.name : "New Project"}
        </Typography.Title>

        <Steps
          onChange={onChange}
          direction="vertical"
          current={current}
          items={steps}
          style={{ width: 250, height: 300 }}
        />
      </Flex>

      <Flex>{renderContent()}</Flex>
    </Flex>
  );
};

export default ProjectDetails;

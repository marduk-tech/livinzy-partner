import React, { useEffect, useState } from "react";
import { Flex, StepProps, Steps, Typography } from "antd";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import ProjectBasicDetails from "./project-basic-details";
import ProjectSpaceDetails from "./project-space-details";
import ProjectSlideDetails from "./project-slide-details";
import { COLORS } from "../../styles/colors";
import { DesignsIcon, DetailsIcon, SpacesIcon } from "../../libs/icons";

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectData }) => {
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<StepProps[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(
    projectData
  );

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  useEffect(() => {
    setSteps([
      {
        title: (
          <Flex vertical>
            <Typography.Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color:
                  current == 0 ? COLORS.primaryColor : COLORS.textColorDark,
              }}
            >
              Details
            </Typography.Text>
            <Typography.Text
              style={{
                color: COLORS.textColorLight,
                fontSize: 12,
              }}
            >
              Add basic info about your project
            </Typography.Text>
          </Flex>
        ),
        status: "finish",
        icon: <DetailsIcon></DetailsIcon>,
      },
      {
        title: (
          <Flex vertical>
            <Typography.Text
              style={{
                fontSize: 16,
                fontWeight: "bold",

                color:
                  current == 1 ? COLORS.primaryColor : COLORS.textColorDark,
              }}
            >
              Spaces
            </Typography.Text>
            <Typography.Text
              style={{
                fontSize: 12,
                color: COLORS.textColorLight,
              }}
            >
              Add the spaces designed.
            </Typography.Text>
          </Flex>
        ),
        status: "finish",
        icon: <SpacesIcon></SpacesIcon>,
        disabled: !currentProject || !currentProject._id,
      },
      {
        title: (
          <Flex vertical>
            <Typography.Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color:
                  current == 2 ? COLORS.primaryColor : COLORS.textColorDark,
              }}
            >
              Designs
            </Typography.Text>
            <Typography.Text
              style={{
                fontSize: 12,
                color: COLORS.textColorLight,
              }}
            >
              Upload actual or 3D design photos.
            </Typography.Text>
          </Flex>
        ),
        status: "finish",
        icon: <DesignsIcon></DesignsIcon>,
        disabled: !currentProject || !currentProject._id,
      },
    ]);
  }, [currentProject, current]);

  const basicDetailsUpdated = (project: Project) => {
    setCurrentProject(project);
    setCurrent(current + 1);
  };

  const renderContent = () => {
    switch (current) {
      case 0:
        return (
          <ProjectBasicDetails
            projectData={currentProject}
            basicDetailsUpdated={basicDetailsUpdated}
          />
        );
      case 1:
        return (
          <ProjectSpaceDetails
            projectData={currentProject}
          ></ProjectSpaceDetails>
        );
      case 2:
        return (
          <ProjectSlideDetails
            projectData={currentProject}
          ></ProjectSlideDetails>
        );
    }
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  return (
    <Flex style={{ backgroundColor: "white", borderRadius: 8 }} align="left">
      {/* <Typography.Title level={3} style={{ margin: 0, marginBottom: 48 }}>
        {projectData ? projectData.name : "New Project"}
      </Typography.Title> */}
      <Flex
        vertical
        style={{
          borderRight: "1px solid",
          borderRightColor: COLORS.borderColor,
          marginRight: 32,
          padding: "24px 8px",
          background: COLORS.bgColor,
        }}
      >
        <Steps
          onChange={onChange}
          direction="vertical"
          current={current}
          items={steps}
          style={{ width: 300, height: 300 }}
        />
      </Flex>

      <Flex style={{ padding: 24, minHeight: 600 }}>{renderContent()}</Flex>
    </Flex>
  );
};

export default ProjectDetails;

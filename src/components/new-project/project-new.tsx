import React, { ChangeEvent, useState } from "react";
import { Button, Flex, Image, Input, Typography, message } from "antd";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import ProjectBasicDetails from "./project-layout";
import { useSaveProject } from "../../hooks/use-projects";
import { useCookies } from "react-cookie";
import { cookieKeys } from "../../libs/react-query/constants";
import { useNavigate } from "react-router-dom";

const ProjectNew: React.FC<ProjectDetailsProps> = ({ projectData }) => {
  const [currentProject, setCurrentProject] = useState<Project | undefined>(
    projectData
  );
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);

  const [projectName, setProjectName] = useState<string>();
  const navigate = useNavigate();

  const saveProjectMutation = useSaveProject();
  const handleNameSubmit = () => {
    const projectData: Project = {
      name: projectName!,
      designerId: cookies[cookieKeys.userId],
    };

    saveProjectMutation.mutate(projectData, {
      onSuccess: (updatedProject: Project) => {
        setCurrentProject(updatedProject);
        message.success("Project created successfully!");
      },
      onError: () => {
        message.error("Failed to save project.");
      },
    });
  };

  const basicDetailsUpdated = (updatedProject: Project) => {
    setCurrentProject(updatedProject);

    if (
      updatedProject &&
      updatedProject.homeDetails &&
      updatedProject.homeDetails.homeType
    ) {
      navigate(`/projects/details/${updatedProject._id}`);
    }
  };

  const onChangeProjectNmae = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const renderProjectNameForm = () => {
    return (
      <Flex vertical style={{ padding: 32 }}>
        <Image width={200} src="../../new-project-icon.jpeg"></Image>
        <Typography.Title level={2}>
          {" "}
          What do you want to name this project ?
        </Typography.Title>
        <Flex gap={16}>
          <Input
            onChange={onChangeProjectNmae}
            style={{ width: 600, height: 75, fontSize: 24 }}
          />
          <Button
            onClick={handleNameSubmit}
            style={{ height: 75, width: 125, fontSize: 24 }}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        minHeight: 540,
      }}
      align="left"
    >
      {currentProject && currentProject?._id ? (
        <ProjectBasicDetails
          basicDetailsUpdated={basicDetailsUpdated}
          projectData={currentProject}
        />
      ) : (
        renderProjectNameForm()
      )}
    </Flex>
  );
};

export default ProjectNew;

import { Button, Flex, Image, Input, Typography, message } from "antd";
import React, { ChangeEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useSaveProject } from "../../hooks/use-projects";
import { Project, ProjectDetailsProps } from "../../interfaces/Project";
import { cookieKeys } from "../../libs/react-query/constants";
import ProjectBasicDetails from "./project-layout";

const ProjectNew: React.FC<ProjectDetailsProps> = ({ projectData }) => {
  const [currentProject, setCurrentProject] = useState<Project | undefined>(
    projectData
  );
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);

  const [projectName, setProjectName] = useState<string>();
  const navigate = useNavigate();

  const saveProjectMutation = useSaveProject();
  const handleNameSubmit = () => {
    const projectData: Partial<Project> = {
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
      <Flex align="center" gap={100}>
        <Flex vertical style={{ padding: 32, width: 600 }}>
          <Typography.Title level={2}>
            {" "}
            What do you want to name this project ?
          </Typography.Title>
          <Input
            onChange={onChangeProjectNmae}
            style={{ width: 400, height: 75, fontSize: 24 }}
          />
          <Button
            onClick={handleNameSubmit}
            style={{ height: 75, width: 125, fontSize: 24, marginTop: 16 }}
          >
            Next
          </Button>
        </Flex>{" "}
        <Image
          width={400}
          preview={false}
          src="../../new-project-icon.jpeg"
          style={{ margin: "auto" }}
        ></Image>
      </Flex>
    );
  };

  return (
    <Flex
      align="center"
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        minHeight: 540,
      }}
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

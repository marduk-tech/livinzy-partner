import { Button, Flex, Input, Typography, message } from "antd";
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
      <Flex align="center" style={{ width: "100%", height: "100%" }}>
        <Flex vertical style={{ width: "40%", padding: "2.5%" }}>
          <Typography.Title level={3}>
            {" "}
            What do you want to name this project ?
          </Typography.Title>
          <Input
            onChange={onChangeProjectNmae}
            style={{ width: 400, height: 75, fontSize: 24 }}
          />
          <Button
            onClick={handleNameSubmit}
            loading={saveProjectMutation.isPending}
            style={{ height: 75, width: 125, fontSize: 24, marginTop: 16 }}
          >
            Next
          </Button>
        </Flex>{" "}
        <Flex
          style={{
            width: "60%",
            height: "80vh",
            backgroundImage: "url(../../landing-bg.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {" "}
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex
      align="center"
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        height: "80vh",
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

import React, { useState } from "react";
import { useFetchProjectsByDesigner } from "../hooks/use-projects";
import { Project } from "../interfaces/Project";
import { Card, Flex, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { cookieKeys } from "../libs/react-query/constants";
import { useCookies } from "react-cookie";
import ProjectDetails from "./project-details/project-details";

const ProjectsList: React.FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);

  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useFetchProjectsByDesigner(cookies[cookieKeys.userId]);
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [createNewProject, setCreateNewProject] = useState<boolean>(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (selectedProject) {
    return <ProjectDetails projectData={selectedProject}></ProjectDetails>;
  }

  if (createNewProject) {
    return <ProjectDetails projectData={selectedProject}></ProjectDetails>;
  }

  return (
    <Flex style={{ width: "100%", flexWrap: "wrap" }} gap={32}>
      <Card
        style={{ width: 320 }}
        hoverable
        cover={
          <div
            style={{
              cursor: "pointer",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: 320,
              height: 240,
              backgroundImage: `url(${"../../new-design.png"})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
        }
        onClick={() => {
          setCreateNewProject(true);
        }}
      >
        <Meta
          title={
            <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
              Upload New
            </Typography.Title>
          }
        />
      </Card>
      {projects?.map((project: Project) => (
        <Card
          hoverable
          onClick={() => {
            setSelectedProject(project);
          }}
          style={{ width: 320, borderRadius: 16 }}
          cover={
            <div
              style={{
                cursor: "pointer",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                width: 320,
                height: 240,
                backgroundImage: `url(${
                  project.previewImageUrl || "../../img-plchlder.png"
                })`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
          }
        >
          <Meta
            title={
              <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
                {project.homeDetails.communityName},{" "}
                {project.homeDetails.homeType.homeType}
              </Typography.Title>
            }
          />
        </Card>
      ))}
    </Flex>
  );
};

export default ProjectsList;

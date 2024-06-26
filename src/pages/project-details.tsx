import { useParams } from "react-router-dom";
import { Loader } from "../components/loader";
import { useFetchProject } from "../hooks/use-projects";
import ProjectSlideDetails from "../components/project-details/project-slide-details";
import ProjectNew from "../components/new-project/project-new";

export function ProjectDetails() {
  const { projectId } = useParams();

  const {
    data: projectData,
    isLoading,
    isError,
    error,
  } = useFetchProject(projectId as string);

  if (isLoading) {
    return <Loader />;
  }

  if (
    projectData &&
    projectData.homeDetails &&
    projectData.homeDetails.homeType
  ) {
    return (
      <ProjectSlideDetails projectData={projectData}></ProjectSlideDetails>
    );
  }

  return <ProjectNew projectData={projectData}></ProjectNew>;
}

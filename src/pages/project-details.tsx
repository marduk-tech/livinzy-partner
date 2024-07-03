import { useParams } from "react-router-dom";
import { Loader } from "../components/loader";
import { useFetchProject } from "../hooks/use-projects";
import ProjectSlideDetails from "../components/project-details/project-slide-details";

export function ProjectDetails() {
  const { projectId } = useParams();

  const { data: projectData, isLoading } = useFetchProject(projectId as string);

  if (isLoading) {
    return <Loader />;
  }

  return <ProjectSlideDetails projectData={projectData}></ProjectSlideDetails>;
}

import { useParams } from "react-router-dom";
import { Loader } from "../components/common/loader";
import ProjectSlideDetails from "../components/project-details/project-details";
import { useFetchProject } from "../hooks/use-projects";

export function ProjectDetails() {
  const { projectId } = useParams();

  const { data: projectData, isLoading } = useFetchProject(projectId as string);

  if (isLoading) {
    return <Loader />;
  }

  return <ProjectSlideDetails projectId={projectId!}></ProjectSlideDetails>;
}

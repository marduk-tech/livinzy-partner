import { useParams } from "react-router-dom";
import { ErrorAlert } from "../../components/error-alert";
import { Loader } from "../../components/loader";
import ProjectDetails from "../../components/project-details/project-details";
import { useFetchProject } from "../../hooks/use-projects";

export function ProjectDetailsPage() {
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

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (projectData) {
    return <ProjectDetails projectData={projectData}></ProjectDetails>;
  }
}

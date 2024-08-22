import { useParams } from "react-router-dom";
import { Loader } from "../components/common/loader";
import ProjectNew from "../components/new-project/project-new";
import { useFetchProject } from "../hooks/use-projects";

export function ProjectAdd() {
  const { projectId } = useParams();

  if (!projectId) {
    return <ProjectNew></ProjectNew>;
  }

  const {
    data: projectData,
    isLoading,
    refetch: refetchProjectData,
  } = useFetchProject(projectId as string);

  if (isLoading) {
    return <Loader />;
  }

  return <ProjectNew projectData={projectData!}></ProjectNew>;
}

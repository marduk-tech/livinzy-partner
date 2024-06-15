// ProjectsList.tsx

import React from "react";
import { useFetchProjects } from "../hooks/use-projects";

interface Project {
  _id: string;
  apartmentDetails: {
    type: string;
    size: string;
    communityName: string;
  };
  designerId: string;
}

const ProjectsList: React.FC = () => {
  const { data: projects, isLoading, isError, error } = useFetchProjects();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div>
      <h1>Projects List</h1>
      <ul>
        {projects?.map((project: Project) => (
          <li key={project._id}>
            <strong>{project.apartmentDetails.communityName}</strong>
            <br />
            {project.apartmentDetails.type}, {project.apartmentDetails.size},{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;

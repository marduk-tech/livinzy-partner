interface HomeDetails {
  communityName: string;
  size: number;
  homeType: {
    description: string;
    homeType: string;
    _id: string;
  };
}

export interface Project {
  _id?: string;
  name: string;
  homeDetails: HomeDetails;
  previewImageUrl: string;
  designerId: string;
}

interface ProjectDetailsProps {
  projectData?: Project;
  basicDetailsUpdated?: any;
}
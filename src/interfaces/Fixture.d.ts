export interface Fixture {
  _id?: string;
  fixtureType?: {
    fixtureType: string;
    _id: string;
  };
  cost?: Number;
  designName?: string;
  description?: string;
  projectId?: string;
  customFittings?: string[];
  imageBounds?: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    imageSize: { width: number; height: number };
  };
}

export interface FixtureFormData {
  _id?: string;
  fixtureType?: string;
  cost?: Number;
  designName?: string;
  description?: string;
  material?: string;
  materialVariation?: string;
  customFittings?: string[];
  materialFinish?: string;
  projectId?: string;
  imageBounds?: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    imageSize: { width: number; height: number };
  };
}

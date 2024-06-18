export interface Fixture {
  _id?: string;
  fixtureType: {
    fixtureType: string;
    _id: string;
  };
  designName?: string;
  description?: string;
  projectId?: string;
}

export interface Fixture {
  _id?: string;
  fixtureType: {
    fixtureType: string;
    _id: string;
  };
  cost: Number;
  designName?: string;
  description?: string;
  projectId?: string;
}

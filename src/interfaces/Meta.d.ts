export interface HomeMeta {
  _id: string;
  homeType: string;
  description: string;
}

export interface SpaceMeta {
  _id: string;
  spaceType: string;
  description: string;
  icon?: string;
}

export interface FixtureMeta {
  _id?: string;
  fixtureType: string;
  description?: string;
  addedByDesignerId?: string;
  materials?: string[];
}

export interface MaterialMeta {
  _id?: string;
  name: string;
  costScore?: string;
  benefit?: string;
  drawback?: string;
}

export interface MaterialVariationMeta {
  _id?: string;
  name: string;
  materialId: string;
  costScore?: string;
  benefit?: string;
  drawback?: string;
}

export interface MaterialFinishMeta {
  _id?: string;
  name: string;
  materialId: string;
  costScore?: string;
  benefit?: string;
  drawback?: string;
}

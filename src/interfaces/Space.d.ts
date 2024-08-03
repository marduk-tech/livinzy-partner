import { Fixture } from "./Fixture";
import { Slide } from "./Slide";

export interface Space {
  _id?: string;
  size: {
    l: number;
    w: number;
    h: number;
  };
  name: string;
  oneLiner: string;
  spaceType: {
    spaceType: string;
    icon: string;
    _id: string;
  };
  cost: number;
  projectId: string;
  slides: Slide[];
  fixtures: Fixture[];
}

export interface SpaceUpdateBody {
  _id?: string;
  size: {
    l: number;
    w: number;
    h: number;
  };
  name: string;
  oneLiner: string;
  spaceType: {
    spaceType: string;
    icon: string;
    _id: string;
  };
  cost: number;
  projectId: string;
  slides: string[];
  fixtures: string[];
}

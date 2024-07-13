import { Space } from "./Space";

export interface Slide {
  _id?: string;
  url: string;
  spaces?: string[];
  fixtures?: string[];
  archived?: boolean;
  fixturesMapping?: IFixturesMapping[];
}

interface SlideDetailsProps {
  slide: Slide;
}

interface IPoint {
  x: number;
  y: number;
}

interface ISize {
  height: number;
  width: number;
}

interface IBoundingBox {
  _id?: string;
  startPoint: IPoint;
  endPoint: IPoint;
  imageSize: ISize;
}

interface IFixturesMapping {
  _id?: string;
  fixtureId: string;
  boundingBox: IBoundingBox;
}

import { Space } from "./Space";

export interface Slide {
  _id?: string;
  url: string;
  spaces?: string[];
  fixtures?: string[];
  archived?: boolean;
}

interface SlideDetailsProps {
  slide: Slide;
}

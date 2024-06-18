export interface Space {
    _id?: string;
    size: {
        l: number,
        w: number,
        h: number
    };
    spaceType: {
        spaceType: string;
        _id: string;
    };
    cost: number;
    projectId: string;
  }
  
export interface ImageDataI {
  frameOffset: number;
  pictureSize: string;
  frameData: string;
}

export class ImageInfoData{
  constructor(
    readonly imageSrc: string,
    readonly imageHeight?: number,
    readonly imageWidth?: number,
  ) {
  }
}

export enum EventSourceStateConnection {
  CONNECTING = 0,
  OPEN = 1,
  CLOSED = 2,
}

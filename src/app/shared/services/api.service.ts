import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ImageDataI } from "../models/app.model";
import { base64ToBytes, bytesToBase64 } from "../helpers/functions";

@Injectable()
export class ApiService {

  private imageDataArray: string[] = [];

  createEventSource(param: number): Observable<string> {
    const imageUrl = this.getImageLink(param);
    const eventSource = new EventSource(imageUrl);
    this.imageDataArray.length = 0;

    return new Observable(observer => {
      eventSource.onmessage = (event: MessageEvent<string>) => {
        const messageData = JSON.parse(event.data) as ImageDataI;
        observer.next(this.combineBase64Str(messageData.frameData));
      };

      eventSource.onerror = (error) => {
        console.log(eventSource.readyState)

        if(eventSource.readyState === 0) {
          observer.error(eventSource.readyState);
          return;
        }
        eventSource.close();
        observer.error(eventSource.readyState);
        // observer.error(error);
        // observer.complete();
        // this.imageDataArray.length = 0;
      };

      return () => {
        eventSource.close();
      };
    });
  }

  private combineBase64Str(str: string): string {
    this.imageDataArray.push(str);
    const combinedBytes = this.imageDataArray.reduce((acc, currArray) => {
        const currArrayBytes = base64ToBytes(currArray);
        const newLength = acc.length + currArrayBytes.length;
        const newArray = new Uint8Array(newLength);
        newArray.set(acc, 0);
        newArray.set(currArrayBytes, acc.length);
        return newArray;
    }, new Uint8Array(0));
    return bytesToBase64(combinedBytes);
  }

  private getImageLink(param: number): string {
    return `https://devfirmware.maks.systems:8443/api/v1/pictures/download/stream/sse/test?testNumber=${param}`;
  }

}

// switch (headerHex) {
//     case "89504E47":
//         return "image/png";
//     case "47494638":
//         return "image/gif";
//     case "FFD8FFE0":
//     case "FFD8FFE1":
//     case "FFD8FFE2":
//         return "image/jpeg";
//     default:
//         return "unknown";
// }

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "./shared/services/api.service";
import { UntypedFormControl } from "@angular/forms";
import { catchError, map, of, Subject, switchMap, takeUntil } from "rxjs";
import { DestroySubscription } from "./shared/helpers/functions";
import { EventSourceStateConnection, ImageInfoData } from "./shared/models/app.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends DestroySubscription implements OnInit {

  imageData: ImageInfoData | null;
  imageDataUpdate$: Subject<number> = new Subject<number>();
  inputControl = new UntypedFormControl(null);


  @ViewChild('imageRef') private readonly imageRef: ElementRef;

  private readonly initialImageSrc = 'data:image/jpeg;base64,';
  private readonly eventSourceStateConnection = EventSourceStateConnection;

  constructor(
    private readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.updateImageData();
  }

  private updateImageData() {
    this.imageDataUpdate$.pipe(
      switchMap((vl) => this.apiService.createEventSource(vl).pipe(
        map(vl => {
          const imageSrc = this.initialImageSrc + vl;
          if(this.imageRef?.nativeElement) {
            const width = this.imageRef.nativeElement.clientWidth;
            const height = this.imageRef.nativeElement.clientHeight;
            this.imageData = new ImageInfoData(imageSrc, width, height);
            return;
          }
          this.imageData = new ImageInfoData(imageSrc);
        }),
        catchError(eventSourceReadyState => of(eventSourceReadyState)),
      )),
      map((vl) => {
        if(vl === this.eventSourceStateConnection.CLOSED) this.imageData = null;
        this.cdr.detectChanges()
      }),
      takeUntil(this.destroyStream$),
    ).subscribe();
  }

  getImage(event: MouseEvent): void {
    const inputValue = +this.inputControl.value;
    this.imageDataUpdate$.next(inputValue);
  }
}

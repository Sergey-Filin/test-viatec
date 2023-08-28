import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from "./shared/services/api.service";
import { ReactiveFormsModule } from "@angular/forms";
import { NgOptimizedImage } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }

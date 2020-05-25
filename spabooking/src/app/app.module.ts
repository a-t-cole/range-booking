import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { AddBookingComponent } from './components/add-booking/add-booking.component';
import {MatDialogModule} from '@angular/material/dialog'; 
export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@NgModule({
  declarations: [
    AppComponent,
    CalendarHeaderComponent,
    AddBookingComponent
  ],
  imports: [
    HttpClientModule, 
    BrowserAnimationsModule, 
    BrowserModule,
    AppRoutingModule,
    MatDialogModule, 
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    NgbModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true, 
      maxOpened: 1

    })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

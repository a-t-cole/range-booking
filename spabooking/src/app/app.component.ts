import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import { DataService } from './services/data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Size } from 'ngx-spinner/lib/ngx-spinner.enum';
import { IUser, ITarget, IReservation, MomentReservation } from './models/api.models';
import { RangeEvent } from './models/calendar.models';
import { MatDialog } from '@angular/material/dialog';
import { AddBookingComponent } from './components/add-booking/add-booking.component';
import { BookingRequest, BookingResult } from './components/add-booking/add-booking.models';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from './services/error-handler.service';
import { DataCache } from './models/generic.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //https://angular-calendar.com/#/async-events <--event loading
  public view: CalendarView = CalendarView.Week;
  public viewDate: Date = new Date(); 
  public events: RangeEvent[] = []; 
  public Data:DataCache = new DataCache()
  private modalOpen: boolean = false; 
  constructor(private dataSvc: DataService, private spinner: NgxSpinnerService, private dialog: MatDialog, private errroHandler: ErrorHandlerService){

  }
  async ngOnInit(): Promise<void> {
    document.body.classList.add('dark-theme');
    this.showBusy(); 
    this.Data.Users = await this.getUsers(); 
    this.Data.Targets = await this.getTargets();
    let reservations = await this.getBookings(); 
    this.events = this.convertReservationToCalendarEvent(reservations);
    this.spinner.hide('Main'); 
  }

  async getBookings() : Promise<MomentReservation[]>{
    let reservations: MomentReservation[] = []; 
    let date = moment().day(0);
    let next = moment().day(0+7).subtract(1, "second");
    let response = await this.dataSvc.getReservations(date, next);
    if(response && response.length){
      reservations.push(...response);
    } 
    return reservations; 
  }
  async getUsers(): Promise<IUser[]>{
    let users:IUser[] = []; 
    let response =  await this.dataSvc.getUsers();
    if(response && response.length){
      users.push(...response);
    }
    return users; 
  }
  async getTargets(): Promise<ITarget[]>{
    let users:ITarget[] = []; 
    let response =  await this.dataSvc.getTargets();
    if(response && response.length){
      users.push(...response);
    }
    return users; 
  }
  async onAddBooking(selectedEvent?: any){
    if(this.modalOpen){
      return; 
    }
    let date = selectedEvent?.date ?? null;
    if(!date){
      date = moment(); 
    }else{
      date = moment(selectedEvent.date);
    }
    console.log('add new booking'+ date);
    this.showBusy(); 

    let valid = await this.getAvailableTargetsForBooking(date); 
    if(!valid.length){
      this.spinner.hide('Main');
      this.errroHandler.throwError('Bookings cannot be accepted for this time slot');
      return;
    }
    this.modalOpen = true; 
    const dialogRef = this.dialog.open(AddBookingComponent, {
      width: "calc(100%-20px)", 
      height: "95%", 
      minWidth: '80%',
      panelClass: "custom-dialog-panel", 
      data: new BookingRequest(this.Data.Users, valid, date, this.getMaxBookingLength(date))
    });
    dialogRef.afterClosed().subscribe((x: BookingResult) => {
      this.modalOpen = false; 
      if(x){
        if(x.userAdded){
          this.Data.Users.push(x.userAdded); 
        }
        
      }
    });
    this.spinner.hide('Main'); 
  }
  async getAvailableTargetsForBooking(date: Date):Promise<ITarget[]>{
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve(false); 
    //   }, 2000);
    // }); 
    let relevantEvents = this.events?.filter(x => x.start <date && x.end > date) ?? [];
    if(relevantEvents && relevantEvents.length){
      let targets = relevantEvents.map(x => x.target)
      return this.Data.Targets.filter(x => !targets.includes(x.name)); 
    }else{
      return this.Data.Targets; 
    }
  }
  getMaxBookingLength(date: Date): number{
    return 60; 
  }
  convertReservationToCalendarEvent(reservations: MomentReservation[]) : CalendarEvent[]{
    let result: CalendarEvent[] = []; 
    if(!reservations){
      return result; 
    }
    for(let r of reservations){
      result.push(new RangeEvent(r));
    }
    return result; 
  }
  showBusy(){
    this.spinner.show('Main', {
      type:'ball-scale-ripple-multiple', 
      size: 'meduium' as Size, 
      bdColor: 'rgba(51,51,51,0.7)', 
      color: '#FFF', 
      fullScreen:true
    });
  }
}

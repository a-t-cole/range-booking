import { Component, OnInit, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingRequest, BookingResult } from './add-booking.models';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Moment } from 'moment';
import { start } from 'repl';
@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit, OnChanges{

  public selectedUser: string = '-1'; 
  public selectedTarget: string = '-1';
  public startTime: any; 
  public endTime: any; 
  ErrorMessage: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: BookingRequest, private dialogRef: MatDialogRef<AddBookingComponent> , private errorHandler: ErrorHandlerService, private dataSvc: DataService) { 

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.validateTimes(); 
  }

  ngOnInit(): void {
    this.setUsers(); 
    this.setTargets(); 
    this.setTimes(); 
  }
  setTimes() {
    this.startTime = {hour: this.data.startTime.hour(), minute: this.data.startTime.minutes()};
    this.endTime = {hour: this.data.startTime.hour()+2, minute: this.data.startTime.minutes()};
  }
  setUsers(){
    if(this.data.Users && this.data.Users.length){
      this.data.Users.sort((a, b) => {
        return a.name < b.name ? 1 : -1; 
      }); 
      this.selectedUser = this.data.Users[0].id.toString() 
    }
  }
  setTargets(){
    if(!(this.data?.Targets?.length ?? 0)){
      this.errorHandler.throwError('No targets are available for this timeslot');
      this.dialogRef.close(); 
      return; 
    }
    this.data.Targets.sort((a, b) => {
      return a.name < b.name ? 1 : -1; 
    });
    this.selectedTarget = this.data.Targets[0].id.toString(); 
  }
  validateTimes(){
    let end:Date = new Date()
    end.setHours(this.endTime.hour, this.endTime.minute);
    
    if(moment(this.data.startTime).add(this.data.MaxBookingMinutes, 'minutes') < moment(end)){
      this.ErrorMessage = `Max session time is ${(this.data.MaxBookingMinutes / 60)} hours.`
    }
  }
  book(){
    let userId = parseInt(this.selectedUser);
    let targetId = parseInt(this.selectedTarget);
    if(isNaN(userId) || userId == null || userId == undefined){
      this.errorHandler.throwError('Could not parse user id');
      return; 
    }
    if(isNaN(targetId) || targetId == null || targetId == undefined){
      this.errorHandler.throwError('Could not parse targetId');
      return; 
    }
    let e = this.getEndDate(this.endTime, this.data.startTime);
    this.dataSvc.book(this.data.startTime, e, userId, targetId)
    .then(() => {
      this.errorHandler.success('Booking Successful');
      this.dialogRef.close(new BookingResult(true)); 
    })
    .catch((e) => {
      this.errorHandler.throwError('Error creating booking: '+e);
      this.dialogRef.close(new BookingResult(false));
    });
  }
  ctrl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    let e = this.getEndDate(control, this.data.startTime);
    if(!e){
      return; 
    }
    if(!e.isAfter(this.data.startTime.add(this.data.MaxBookingMinutes, 'minutes'))){
      return {maxLengthError: true};
    }else if(e.isSameOrBefore(this.data.startTime)){
      return {beforeStartTimeError: true};
    }

    return null;
  });
  getEndDate(control: any, startDate: Moment):Moment{
    let e: Moment = moment(startDate);
    if(!control || (control && !control.hour)){
      e.add(1, 'hour');
    }
    else{
      e.set('hour', control.hour);
      e.set('minute', control.minute);
      return e; 
    }
  }
}

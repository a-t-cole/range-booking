import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingRequest } from './add-booking.models';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: BookingRequest, private dialogRef: MatDialogRef<AddBookingComponent> ) { 

  }

  ngOnInit(): void {
  }

}

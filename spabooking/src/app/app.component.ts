import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  ngOnInit(): void {
    document.body.classList.add('dark-theme');
  }
  title = 'spabooking';
  public view: CalendarView = CalendarView.Week;
  public viewDate: Date = new Date(); 
  public events: any[] = []; 
}

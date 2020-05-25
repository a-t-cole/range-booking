import { CalendarEvent } from 'angular-calendar';
import {EventAction, EventColor} from 'calendar-utils'; 
import { IReservation } from './api.models';

export class RangeEvent implements CalendarEvent{
    constructor(r: IReservation){
        if(!r){
            return; 
        }
        this.id = r.ResId; 
        this.title = r.User; 
        this.start = r.StartTime; 
        this.end = r.EndTime; 
    }
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor = {primary: 'blue', secondary: 'white'};  
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: { beforeStart?: boolean; afterEnd?: boolean; };
    draggable?: boolean = false;
    meta?: any;

}
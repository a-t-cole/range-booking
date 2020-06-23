import { CalendarEvent } from 'angular-calendar';
import {EventAction, EventColor} from 'calendar-utils'; 
import { IReservation, MomentReservation } from './api.models';
import { Moment } from 'moment';

export class RangeEvent implements CalendarEvent{
    constructor(r: MomentReservation){
        if(!r){
            return; 
        }
        this.id = r.ResId; 
        this.title = r.User; 
        this.start = new Date(r.StartTime); 
        this.end = new Date(r.EndTime); 
        this.user  = r.User; 
        this.target = r.Target; 
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
    target?: string; 
    user?: string; 

}
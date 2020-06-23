import { Moment } from 'moment';

export interface IUser{
    id: number, 
    name: string
}
export interface ITarget{
    id: number, 
    name: string
}
export interface IReservation{
    ResId: number, 
    User: string,
    Target: string, 
    StartTime: Date, 
    EndTime: Date 
}
export interface MomentReservation{
    ResId: number, 
    User: string,
    Target: string, 
    StartTime: string, 
    EndTime: string 
}
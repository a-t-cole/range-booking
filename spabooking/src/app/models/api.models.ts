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
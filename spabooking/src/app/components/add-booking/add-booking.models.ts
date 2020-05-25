import { IUser, ITarget, IReservation } from 'src/app/models/api.models';

export class BookingRequest{
    constructor(public Users: IUser[], public Targets: ITarget[], startTime: Date){

    }
}
export class BookingResult{
    constructor(public reservation?: IReservation, public userAdded?: IUser){

    }
}
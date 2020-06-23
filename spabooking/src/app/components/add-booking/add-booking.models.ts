import { IUser, ITarget, IReservation } from 'src/app/models/api.models';
import { Moment } from 'moment';

export class BookingRequest{
    constructor(public Users: IUser[], public Targets: ITarget[], public startTime: Moment, public MaxBookingMinutes: number){

    }
}
export class BookingResult{
    constructor(reservationSuccess: boolean, public userAdded?: IUser){

    }
}
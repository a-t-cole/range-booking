import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUser, ITarget, IReservation, MomentReservation } from '../models/api.models';
import { Moment } from 'moment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class DataService {

  private readonly baseurl: string = '';
  constructor(private http: HttpClient) {
    if(!environment.production){
      this.baseurl = "http://localhost:3000";
    }

   }
  getUsers(){
    return this.http.get<IUser[]>(this.baseurl+'/getusers').toPromise();
  }
  getTargets(){
    return this.http.get<ITarget[]>(this.baseurl+'/gettargets').toPromise();
  }
  getReservations(startDate: any, endDate: any){
    if(!startDate || !endDate){
      throw 'No start or end date detected';
    }
    return this.http.post<MomentReservation[]>(this.baseurl+'/getreservations', {
      startDate: startDate, 
      endDate: endDate
    }).toPromise()
  }
  book(startDate: Moment, endDate: Moment, userId: number, tartgetId: number ){
    return this.http.post(this.baseurl+'/addreservation',{
      startDate: startDate, 
      endDate: endDate, 
      userId: userId, 
      targetId: tartgetId
    } ).toPromise(); 
  }
}

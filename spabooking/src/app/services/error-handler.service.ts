import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastrSvc: ToastrService) { }

  throwError(message: string, duration?: number){
    if(!message){
      return; 
    }
    if(!duration){
      duration  = 5000; 
    }
    this.toastrSvc.error(message, "", {
      timeOut: duration,
      positionClass: 'toast-top-center'
    });
  }
  success(message: string, duration?: number){
    if(!message){
      return; 
    }
    if(!duration){
      duration  = 5000; 
    }
    this.toastrSvc.success(message, "", {
      timeOut: duration,
      positionClass: 'toast-top-center'
    })
  }
}

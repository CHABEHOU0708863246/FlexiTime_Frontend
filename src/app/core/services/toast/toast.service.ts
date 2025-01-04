import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}


@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastSubject.next({ message, type });
  }

}

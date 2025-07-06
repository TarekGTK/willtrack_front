import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stock } from '../model/stock.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket = new WebSocket('ws://localhost:1919/ws');
  private subject = new Subject<Stock>();

  constructor() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subject.next(data);
      console.log(data);
      
    };
  }

  onStockUpdate(): Observable<Stock> {
    return this.subject.asObservable();
  }
}

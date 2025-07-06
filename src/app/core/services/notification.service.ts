import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notifications } from '../model/notification.model';
import {GlobalComponent} from "../../global-component";
import {User} from "../../store/Authentication/auth.models";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = GlobalComponent.API_URL;
  private readonly NOTIFICATIONS: string = "notifications/"


  constructor(private http: HttpClient) { }

  createNotification(message: string, senduserId: number, offerId: number, receiveuserId: number): Observable<Notifications> {
    const params = new HttpParams()
      .set('message', message)
      .set('senduserId', senduserId)
      .set('offerId', offerId)
      .set('receiveuserId', receiveuserId);
    return this.http.post<Notifications>(this.API_URL + this.NOTIFICATIONS +`createNotification`, params);
  }

  getNotificationsByReceiveuserId(receiveuserId: number): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(this.API_URL + this.NOTIFICATIONS +`user/${receiveuserId}`);
  }

  countUnreadNotificationsByReceiveuserId(receiveuserId: number): Observable<number> {
    return this.http.get<number>(this.API_URL + this.NOTIFICATIONS +`unreadCount/${receiveuserId}`);
  }

  markNotificationAsRead(id: number): Observable<any> {
    return this.http.put<any>(this.API_URL + this.NOTIFICATIONS +`markAsRead/${id}`, {});
  }

  getUserBySenduserId(senduserId: number): Observable<User> {
    return this.http.get<User>(this.API_URL + this.NOTIFICATIONS +`senduser/${senduserId}`);
  }

}

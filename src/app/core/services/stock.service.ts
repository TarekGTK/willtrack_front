import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../model/stock.model';

@Injectable({
  providedIn: 'root'
})

export class StockService {

  private api = 'http://localhost:1919/api/stocks';

  constructor(private http: HttpClient) {}

  getStockByMagasin(id: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.api}/magasins/${id}`);
  }

  getAlertes(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.api}/alertes`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IOrder, IOrderToCreate } from '../shared/models/order';

@Injectable( {
  providedIn: 'root'
} )
export class CheckoutService {

  baseUrl = environment.apiUrl

  constructor( private http: HttpClient ) { }

  createOrder( order: IOrderToCreate ) {
    return this.http.post<IOrder>( `${ this.baseUrl }/orders`, order )
  }

  getDeliveryMethods() {
    return this.http.get<Array<IDeliveryMethod>>( `${ this.baseUrl }/orders/delivery/methods` )
      .pipe(
        map( ( methods: Array<IDeliveryMethod> ) => {
          return methods.sort( ( a, b ) => b.price - a.price )
        } )
      )
  }
}

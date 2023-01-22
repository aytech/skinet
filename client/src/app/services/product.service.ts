import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { IProducts } from '../models/products'

@Injectable( {
  providedIn: 'root'
} )
export class ProductService {

  private baseUrl = 'https://localhost:7125/api/products'

  constructor( private http: HttpClient ) { }

  getProducts(): Observable<IProducts> {
    return this.http.get<IProducts>( `${ this.baseUrl }?pageSize=50` )
  }
}

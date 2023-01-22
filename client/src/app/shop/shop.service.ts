import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBrand } from '../shared/models/brands';
import { IProducts } from '../shared/models/products';
import { IProductType } from '../shared/models/productType';

@Injectable( {
  providedIn: 'root'
} )
export class ShopService {

  private baseUrl = 'https://localhost:7125/api'

  constructor( private http: HttpClient ) { }

  getProducts(): Observable<IProducts> {
    return this.http.get<IProducts>( `${ this.baseUrl }/products?pageSize=50` )
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>( `${ this.baseUrl }/products/brands` )
  }

  getProductTypes(): Observable<IProductType[]> {
    return this.http.get<IProductType[]>( `${ this.baseUrl }/products/types` )
  }
}

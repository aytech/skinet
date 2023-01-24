import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBrand } from '../shared/models/brands';
import { IProducts } from '../shared/models/products';
import { IProductType } from '../shared/models/productType';

@Injectable( {
  providedIn: 'root'
} )
export class ShopService {

  private baseUrl = 'https://localhost:7125/api'

  constructor( private http: HttpClient ) { }

  getProducts( brandId?: number, typeId?: number ): Observable<IProducts | null> {
    let params = new HttpParams()
    if ( brandId !== undefined ) {
      params = params.append( "brandId", brandId.toString() )
    }
    if ( typeId !== undefined ) {
      params = params.append( "typeId", typeId.toString() )
    }
    params = params.append( "pageSize", 50 )
    return this.http.get<IProducts>( `${ this.baseUrl }/products`, { observe: "response", params } )
      .pipe( map( response => response.body ) )
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>( `${ this.baseUrl }/products/brands` )
  }

  getProductTypes(): Observable<IProductType[]> {
    return this.http.get<IProductType[]>( `${ this.baseUrl }/products/types` )
  }
}

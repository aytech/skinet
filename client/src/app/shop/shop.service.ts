import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBrand } from '../shared/models/brands';
import { IProduct } from '../shared/models/product';
import { IProducts } from '../shared/models/products';
import { IProductType } from '../shared/models/productType';
import { ShopParameters } from '../shared/models/shopParameters';

@Injectable( {
  providedIn: 'root'
} )
export class ShopService {

  private baseUrl = 'https://localhost:7125/api'

  constructor( private http: HttpClient ) { }

  getProducts( parameters: ShopParameters ): Observable<IProducts | null> {
    let params = new HttpParams()
    if ( parameters.brandId > 0 ) {
      params = params.append( "brandId", parameters.brandId.toString() )
    }
    if ( parameters.typeId > 0 ) {
      params = params.append( "typeId", parameters.typeId.toString() )
    }
    if ( parameters.sort !== undefined ) {
      params = params.append( "sort", parameters.sort )
    }
    if ( parameters.search !== undefined ) {
      params = params.append( "search", parameters.search )
    }
    params = params.append( "page", parameters.pageNumber.toString() )
    params = params.append( "pageSize", parameters.pageSize.toString() )
    return this.http.get<IProducts>( `${ this.baseUrl }/products`, { observe: "response", params } )
      .pipe( map( response => response.body ) )
  }

  getProduct( id: number ) {
    return this.http.get<IProduct>( `${ this.baseUrl }/products/${ id }` )
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>( `${ this.baseUrl }/products/brands` )
  }

  getProductTypes(): Observable<IProductType[]> {
    return this.http.get<IProductType[]>( `${ this.baseUrl }/products/types` )
  }
}

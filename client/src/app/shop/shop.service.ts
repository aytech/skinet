import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { IBrand } from '../shared/models/brands';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopParameters } from '../shared/models/shopParameters';

@Injectable( {
  providedIn: 'root'
} )
export class ShopService {

  private baseUrl = 'https://localhost:7125/api'
  products: IProduct[] = []
  brands?: IBrand[]
  types?: IProductType[]
  pagination: Pagination = new Pagination()
  shopParameters: ShopParameters = new ShopParameters()
  productCache: Map<string, IProduct[]> = new Map()

  constructor( private http: HttpClient ) { }

  getProducts( useCache: boolean ): Observable<IPagination | null> {

    if ( useCache === false ) {
      this.productCache = new Map()
    }

    if ( this.productCache.size > 0 && useCache === true ) {
      const cache = this.productCache.get( Object.values( this.shopParameters ).join( "-" ) )
      if ( cache !== undefined ) {
        this.pagination.data = cache
        return of( this.pagination )
      }
    }

    let params = new HttpParams()
    if ( this.shopParameters.brandId > 0 ) {
      params = params.append( "brandId", this.shopParameters.brandId.toString() )
    }
    if ( this.shopParameters.typeId > 0 ) {
      params = params.append( "typeId", this.shopParameters.typeId.toString() )
    }
    if ( this.shopParameters.sort !== undefined ) {
      params = params.append( "sort", this.shopParameters.sort )
    }
    if ( this.shopParameters.search !== undefined ) {
      params = params.append( "search", this.shopParameters.search )
    }
    params = params.append( "page", this.shopParameters.pageNumber.toString() )
    params = params.append( "pageSize", this.shopParameters.pageSize.toString() )

    return this.http.get<IPagination>( `${ this.baseUrl }/products`, { observe: "response", params } )
      .pipe( map( response => {
        if ( response.body !== null ) {
          this.productCache.set( Object.values( this.shopParameters ).join( "-" ), response.body.data )
          this.products = [ ...this.products, ...response.body.data ]
          this.pagination = response.body
        }
        return this.pagination
      } ) )
  }

  getShopParameters() {
    return this.shopParameters
  }

  setShopParameters( parameters: ShopParameters ) {
    this.shopParameters = parameters
  }

  getProduct( id: number ) {
    let product: IProduct | undefined
    this.productCache.forEach( ( products: IProduct[] ) => {
      const cachedProduct = products.find( p => p.id == id )
      if ( cachedProduct !== undefined ) {
        product = cachedProduct
      }
    } )

    if ( product !== undefined ) {
      return of( product )
    }
    return this.http.get<IProduct>( `${ this.baseUrl }/products/${ id }` )
  }

  getBrands(): Observable<IBrand[]> {
    if ( this.brands !== undefined && this.brands?.length > 0 ) {
      return of( this.brands );
    }
    return this.http.get<IBrand[]>( `${ this.baseUrl }/products/brands` )
      .pipe( map( response => {
        this.brands = response
        return response
      } ) )
  }

  getProductTypes(): Observable<IProductType[]> {
    if ( this.types !== undefined && this.types?.length > 0 ) {
      return of( this.types );
    }
    return this.http.get<IProductType[]>( `${ this.baseUrl }/products/types` )
      .pipe( map( response => {
        this.types = response
        return response
      } ) )
  }
}

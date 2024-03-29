import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable( {
  providedIn: 'root'
} )
export class BasketService {

  baseUrl = environment.apiUrl

  private basketSource = new BehaviorSubject<IBasket | null>( null )
  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>( null )

  basket$ = this.basketSource.asObservable()
  basketTotal$ = this.basketTotalSource.asObservable()

  shipping?: number = 0

  constructor( private http: HttpClient ) { }

  createPaymentIntent() {
    return this.http
      .post<IBasket>( `${ this.baseUrl }/payments/${ this.getCurrentBasketValue()?.id }`, {} )
      .pipe( map( ( basket: IBasket ) => {
        this.basketSource.next( basket )
      } ) )
  }

  setShippingPrice( deliveryMethod: IDeliveryMethod ) {
    this.shipping = deliveryMethod.price
    this.calculateTotals()
    const basket = this.getCurrentBasketValue()
    if ( basket !== null ) {
      basket.deliveryMethodId = deliveryMethod.id
      basket.shippingPrice = deliveryMethod.price
      this.setBasket( basket )
    }
  }

  getBasket( id: string ) {
    return this.http.get<IBasket>( `${ this.baseUrl }/basket?id=${ id }` )
      .pipe(
        map( ( basket: IBasket ) => {
          this.basketSource.next( basket )
          this.shipping = basket.shippingPrice
          this.calculateTotals()
        } )
      )
  }

  setBasket( basket: IBasket ) {
    return this.http.post<IBasket>( `${ this.baseUrl }/basket`, basket ).subscribe( {
      next: value => {
        this.basketSource.next( value )
        this.calculateTotals()
      },
      error: error => console.log( error )
    } )
  }

  getCurrentBasketValue(): IBasket | null {
    return this.basketSource.value
  }

  addItemToBasket( item?: IProduct, quantity = 1 ) {
    if ( item !== undefined ) {
      const itemToAdd: IBasketItem = this.mapProductItemToBasketItem( item, quantity )
      const basket = this.getCurrentBasketValue() ?? this.createBasket()
      basket.items = this.addOrUpdateItem( basket.items, itemToAdd, quantity )
      this.setBasket( basket )
    }
  }

  incrementItemQuantity( item: IBasketItem ) {
    const basket = this.getCurrentBasketValue()
    const foundItemIndex = basket?.items.findIndex( x => x.id === item.id )
    if ( basket !== undefined && basket !== null && foundItemIndex !== undefined ) {
      basket.items[ foundItemIndex ].quantity++
      this.setBasket( basket )
    }
  }

  decrementItemQuantity( item: IBasketItem ) {
    const basket = this.getCurrentBasketValue()
    const foundItemIndex = basket?.items.findIndex( x => x.id === item.id )
    if ( basket !== undefined && basket !== null && foundItemIndex !== undefined ) {
      if ( basket.items[ foundItemIndex ].quantity > 1 ) {
        basket.items[ foundItemIndex ].quantity--
        this.setBasket( basket )
      } else {
        this.removeItemFromBasket( item )
      }
    }
  }

  removeItemFromBasket( item: IBasketItem ) {
    const basket = this.getCurrentBasketValue()
    if ( basket?.items.some( x => x.id === item.id ) ) {
      basket.items = basket.items.filter( i => i.id !== item.id )
      if ( basket.items.length > 0 ) {
        this.setBasket( basket )
      } else {
        this.deleteBasket( basket )
      }
    }
  }

  deleteLocalBasket( id: string ) {
    this.basketSource.next( null )
    this.basketTotalSource.next( null )
    localStorage.removeItem( "basket_id" )
  }

  deleteBasket( basket: IBasket ) {
    return this.http.delete( `${ this.baseUrl }/basket?id=${ basket.id }` )
      .subscribe( {
        next: () => {
          this.basketSource.next( null )
          this.basketTotalSource.next( null )
          localStorage.removeItem( "basket_id" )
        },
        error: error => console.log( error )
      } )
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue()
    const shipping = this.shipping === undefined ? 0 : this.shipping
    const subtotal = basket === undefined || basket === null
      ? 0
      : basket.items.reduce( ( a, b ) => ( b.price * b.quantity ) + a, 0 )
    const total = subtotal === undefined ? 0 : subtotal + shipping
    this.basketTotalSource.next( { shipping, total, subtotal } )
  }

  private addOrUpdateItem( items: IBasketItem[], itemToAdd: IBasketItem, quantity: number ): IBasketItem[] {
    const index = items.findIndex( i => i.id === itemToAdd.id )
    if ( index === -1 ) {
      itemToAdd.quantity = quantity
      items.push( itemToAdd )
    } else {
      items[ index ].quantity += quantity
    }
    return items
  }

  private createBasket(): IBasket {
    const basket = new Basket()
    localStorage.setItem( "basket_id", basket.id )
    return basket
  }

  private mapProductItemToBasketItem( item: IProduct, quantity: number ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }
}

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component( {
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: [ './checkout-payment.component.scss' ]
} )
export class CheckoutPaymentComponent {

  @Input() checkoutForm!: FormGroup

  constructor( private basketService: BasketService, private checkoutService: CheckoutService, private toastrService: ToastrService, private router: Router ) { }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue()
    if ( basket !== null ) {
      const orderToCreate = this.getOrderToCreate( basket )
      this.checkoutService.createOrder( orderToCreate )
        .subscribe( {
          next: ( order: IOrder ) => {
            console.info( `Order ${ order.id } created` )
            console.info( order )
            this.basketService.deleteLocalBasket( basket.id )
            this.toastrService.success( "Order created successfully" )
            const navigationExtras: NavigationExtras = { state: order }
            this.router.navigate( [ "checkout/success" ], navigationExtras )
          },
          error: error => {
            console.error( error )
            this.toastrService.error( "Could not create order" )
          }
        } )
    }
  }

  private getOrderToCreate( basket: IBasket ): IOrderToCreate {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get( "deliveryForm" )?.get( "deliveryMethod" )?.value,
      shipToAddress: this.checkoutForm.get( "addressForm" )?.value
    }
  }
}

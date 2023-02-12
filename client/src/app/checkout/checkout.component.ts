import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IAddress } from '../shared/models/address';
import { IBasketTotals } from '../shared/models/basket';

@Component( {
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: [ './checkout.component.scss' ]
} )
export class CheckoutComponent implements OnInit {

  basketTotals$!: Observable<IBasketTotals | null>

  checkoutForm!: FormGroup

  constructor( private formBuilder: FormBuilder, private accountService: AccountService, private basketService: BasketService ) { }

  ngOnInit(): void {
    this.createCheckoutForm()
    this.getAddressFormValues()
    this.basketTotals$ = this.basketService.basketTotal$
  }

  createCheckoutForm() {
    this.checkoutForm = this.formBuilder.group( {
      addressForm: this.formBuilder.group( {
        firstName: [ null, Validators.required ],
        lastName: [ null, Validators.required ],
        street: [ null, Validators.required ],
        city: [ null, Validators.required ],
        state: [ null, Validators.required ],
        zipCode: [ null, Validators.required ]
      } ),
      deliveryForm: this.formBuilder.group( {
        deliveryMethod: [ null, Validators.required ]
      } ),
      paymentForm: this.formBuilder.group( {
        nameOnCard: [ null, Validators.required ]
      } )
    } )
  }

  getAddressFormValues() {
    this.accountService.getUserAddress()
      .subscribe( {
        next: ( address: IAddress ) => {
          if ( address !== null ) {
            this.checkoutForm.get( "addressForm" )?.patchValue( address )
          }
        },
        error: error => console.log( error )
      } )
  }
}

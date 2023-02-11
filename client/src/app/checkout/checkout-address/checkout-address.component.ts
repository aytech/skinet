import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';

@Component( {
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: [ './checkout-address.component.scss' ]
} )
export class CheckoutAddressComponent {

  @Input() checkoutForm!: FormGroup

  constructor( private accountService: AccountService, private toastrService: ToastrService ) { }

  saveUserAddress() {
    this.accountService
      .updateUserAddress( this.checkoutForm.get( "addressForm" )?.value )
      .subscribe( {
        next: _ => this.toastrService.success( "Address saved" ),
        error: error => {
          console.log( error )
          this.toastrService.error( "Could not save the address" )
        }
      } )
  }
}

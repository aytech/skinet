import { Component, OnInit } from '@angular/core'
import { AccountService } from './account/account.service'
import { BasketService } from './basket/basket.service'

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit {

  title = "SkiNet"

  constructor( private basketService: BasketService, private accountService: AccountService ) { }

  ngOnInit(): void {
    this.loadBasket()
    this.loadCurrentUser()
  }

  loadBasket() {
    const basketId = localStorage.getItem( "basket_id" )
    if ( basketId !== null ) {
      this.basketService.getBasket( basketId ).subscribe( {
        next: _ => console.log( "Initialized basket" ),
        error: error => console.log( error )
      } )
    }
  }

  loadCurrentUser() {
    const token = localStorage.getItem( "token" )
    // this.accountService.loadCurrentUser( token ).subscribe((value: any) => console.log(value))
    this.accountService.loadCurrentUser( token ).subscribe( {
      next: _ => console.log( "Loaded user" ),
      error: error => console.log( error )
    } )
  }
}

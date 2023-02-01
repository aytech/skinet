import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component( {
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: [ './product-details.component.scss' ]
} )
export class ProductDetailsComponent implements OnInit {

  product!: IProduct
  quantity: number = 1

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private basketService: BasketService ) {
    breadcrumbService.set( "@productDetails", " " )
  }

  ngOnInit(): void {
    this.loadProduct()
  }

  addItemToBasket() {
    this.basketService.addItemToBasket( this.product, this.quantity )
  }

  incrementQuantity() {
    this.quantity++
  }

  decrementQuantity() {
    if ( this.quantity > 1 ) {
      this.quantity--
    }
  }

  loadProduct() {
    const productId: string | null = this.activatedRoute.snapshot.paramMap.get( "id" )
    if ( productId !== null ) {
      this.shopService.getProduct( +productId ).subscribe( {
        next: value => {
          this.product = value
          this.breadcrumbService.set( "@productDetails", value.name )
        },
        error: error => console.log( error )
      } )
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component( {
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: [ './product-details.component.scss' ]
} )
export class ProductDetailsComponent implements OnInit {

  product!: IProduct;

  constructor( private shopService: ShopService, private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService ) {
    breadcrumbService.set( "@productDetails", " " )
  }

  ngOnInit(): void {
    this.loadProduct()
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

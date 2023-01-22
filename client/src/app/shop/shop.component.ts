import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brands';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopService } from './shop.service';

@Component( {
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: [ './shop.component.scss' ]
} )
export class ShopComponent implements OnInit {

  products: IProduct[] = []
  brands: IBrand[] = []
  productTypes: IProductType[] = []

  constructor( private service: ShopService ) { }

  ngOnInit(): void {
    this.getProducts()
    this.getBrands()
    this.getProductTypes()
  }

  getProducts() {
    this.service.getProducts()
      .subscribe( {
        next: value => this.products = value.data,
        error: ( error ) => console.error( error )
      } )
  }

  getBrands() {
    this.service.getBrands()
      .subscribe( {
        next: value => this.brands = value,
        error: ( error ) => console.error( error )
      } )
  }

  getProductTypes() {
    this.service.getProductTypes()
      .subscribe( {
        next: value => this.productTypes = value,
        error: ( error ) => console.error( error )
      } )
  }
}

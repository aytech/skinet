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

  products?: IProduct[]
  brands!: IBrand[]
  productTypes!: IProductType[]
  brandIdSelected: number = 0;
  typeIdSelected: number = 0;
  sortSelected: string = "name";
  sortOptions: Array<{ name: string, value: string }> = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Low to High", value: "priceAsc" },
    { name: "Price: High to Low", value: "priceDesc" }
  ]

  constructor( private service: ShopService ) { }

  ngOnInit(): void {
    this.getProducts()
    this.getBrands()
    this.getProductTypes()
  }

  getProducts() {
    this.service.getProducts( this.brandIdSelected, this.typeIdSelected, this.sortSelected )
      .subscribe( {
        next: value => this.products = value?.data,
        error: ( error ) => console.error( error )
      } )
  }

  getBrands() {
    this.service.getBrands()
      .subscribe( {
        next: value => this.brands = [ { id: 0, name: "All" }, ...value ],
        error: ( error ) => console.error( error )
      } )
  }

  getProductTypes() {
    this.service.getProductTypes()
      .subscribe( {
        next: value => this.productTypes = [ { id: 0, name: "All" }, ...value ],
        error: ( error ) => console.error( error )
      } )
  }

  onBrandSelected( brandId: number ) {
    this.brandIdSelected = brandId
    this.getProducts()
  }

  onTypeSelected( typeId: number ) {
    this.typeIdSelected = typeId
    this.getProducts()
  }

  onSortSelected( target: any ) {
    this.sortSelected = target.value
    this.getProducts()
  }
}

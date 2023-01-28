import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brands';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopParameters } from '../shared/models/shopParameters';
import { ShopService } from './shop.service';

@Component( {
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: [ './shop.component.scss' ]
} )
export class ShopComponent implements OnInit {

  @ViewChild( "search", { static: false } ) searchTerm: ElementRef | undefined

  products?: IProduct[]
  brands!: IBrand[]
  productTypes!: IProductType[]
  shopParameters = new ShopParameters()
  sortOptions: Array<{ name: string, value: string }> = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Low to High", value: "priceAsc" },
    { name: "Price: High to Low", value: "priceDesc" }
  ]
  totalPageCount: number = 0


  constructor( private service: ShopService ) { }

  ngOnInit(): void {
    this.getProducts()
    this.getBrands()
    this.getProductTypes()
  }

  getProducts() {
    this.service.getProducts( this.shopParameters )
      .subscribe( {
        next: value => {
          this.products = value?.data,
            this.shopParameters.setPageNumber( value?.page )
          this.shopParameters.setPageSize( value?.pageSize )
          this.totalPageCount = value?.count || 0
        },
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
    this.shopParameters.brandId = brandId
    this.shopParameters.pageNumber = 1
    this.getProducts()
  }

  onTypeSelected( typeId: number ) {
    this.shopParameters.typeId = typeId
    this.shopParameters.pageNumber = 1
    this.getProducts()
  }

  onSortSelected( target: any ) {
    this.shopParameters.sort = target.value
    this.getProducts()
  }

  onPageChanged( page: number ) {
    if ( this.shopParameters.pageNumber !== page ) {
      this.shopParameters.setPageNumber( page )
      this.getProducts()
    }
  }

  onSearch( event: Event ) {
    event.preventDefault()
    if ( this.searchTerm !== undefined ) {
      this.shopParameters.search = this.searchTerm.nativeElement.value
      this.shopParameters.pageNumber = 1
      this.getProducts()
    }
  }

  onReset( event: MouseEvent ) {
    event.preventDefault()
    if ( this.searchTerm !== undefined ) {
      this.searchTerm.nativeElement.value = ""
      this.shopParameters = new ShopParameters()
      this.getProducts()
    }
  }
}

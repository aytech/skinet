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
  shopParameters: ShopParameters
  sortOptions: Array<{ name: string, value: string }> = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Low to High", value: "priceAsc" },
    { name: "Price: High to Low", value: "priceDesc" }
  ]
  totalPageCount: number = 0


  constructor( private service: ShopService ) {
    this.shopParameters = service.getShopParameters()
  }

  ngOnInit(): void {
    this.getProducts( true )
    this.getBrands()
    this.getProductTypes()
  }

  getProducts( useCache: boolean = false ) {
    this.service.getProducts( useCache )
      .subscribe( {
        next: value => {
          this.products = value?.data
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
    const parameters = this.service.getShopParameters()
    parameters.brandId = brandId
    parameters.pageNumber = 1
    this.service.setShopParameters( parameters )
    this.getProducts()
  }

  onTypeSelected( typeId: number ) {
    const parameters = this.service.getShopParameters()
    parameters.typeId = typeId
    parameters.pageNumber = 1
    this.service.setShopParameters( parameters )
    this.getProducts()
  }

  onSortSelected( target: any ) {
    const parameters = this.service.getShopParameters()
    parameters.sort = target.value
    this.service.setShopParameters( parameters )
    this.getProducts()
  }

  onPageChanged( page: number ) {
    if ( this.shopParameters.pageNumber !== page ) {
      const parameters = this.service.getShopParameters()
      parameters.setPageNumber( page )
      this.service.setShopParameters( parameters )
      this.getProducts( true )
    }
  }

  onSearch( event: Event ) {
    event.preventDefault()
    if ( this.searchTerm !== undefined ) {
      const parameters = this.service.getShopParameters()
      parameters.search = this.searchTerm.nativeElement.value
      parameters.pageNumber = 1
      this.service.setShopParameters( parameters )
      this.getProducts()
    }
  }

  onReset( event: MouseEvent ) {
    event.preventDefault()
    if ( this.searchTerm !== undefined ) {
      this.searchTerm.nativeElement.value = ""
      this.shopParameters = new ShopParameters()
      this.service.setShopParameters( this.shopParameters )
      this.getProducts()
    }
  }
}

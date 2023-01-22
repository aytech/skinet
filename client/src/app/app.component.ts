import { Component, OnInit } from '@angular/core'
import { IProduct } from './models/product'
import { IProducts } from './models/products'
import { ProductService } from './services/product.service'

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit {

  title = 'SkiNet'
  products: IProduct[] = []

  constructor( private productService: ProductService ) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe( {
        next: ( value: IProducts ) => this.products = value.data,
        error: (error: any) => console.log(error)
      } )
  }
}

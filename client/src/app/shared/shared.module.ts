import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { PaginationHeaderComponent } from './components/pagination-header/pagination-header.component'
import { PaginationComponent } from './components/pagination/pagination.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component'



@NgModule( {
  declarations: [
    PaginationHeaderComponent,
    PaginationComponent,
    OrderTotalsComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports: [
    CarouselModule,
    OrderTotalsComponent,
    PaginationModule,
    PaginationComponent,
    PaginationHeaderComponent
  ]
} )
export class SharedModule { }

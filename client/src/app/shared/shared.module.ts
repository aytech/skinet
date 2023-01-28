import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { PaginationHeaderComponent } from './components/pagination-header/pagination-header.component'
import { PaginationComponent } from './components/pagination/pagination.component'



@NgModule( {
  declarations: [
    PaginationHeaderComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports: [
    CarouselModule,
    PaginationModule,
    PaginationComponent,
    PaginationHeaderComponent
  ]
} )
export class SharedModule { }

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {CdkStepperModule} from "@angular/cdk/stepper"
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { PaginationHeaderComponent } from './components/pagination-header/pagination-header.component'
import { PaginationComponent } from './components/pagination/pagination.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component'
import { ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './components/text-input/text-input.component'
import { StepperComponent } from './components/stepper/stepper.component'


@NgModule( {
  declarations: [
    PaginationHeaderComponent,
    PaginationComponent,
    OrderTotalsComponent,
    StepperComponent,
    TextInputComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    CdkStepperModule
  ],
  exports: [
    CarouselModule,
    OrderTotalsComponent,
    PaginationModule,
    PaginationComponent,
    PaginationHeaderComponent,
    ReactiveFormsModule,
    BsDropdownModule,
    TextInputComponent,
    CdkStepperModule,
    StepperComponent
  ]
} )
export class SharedModule { }

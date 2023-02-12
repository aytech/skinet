import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  { path: "", component: OrdersComponent },
  { path: ":id", component: OrderDetailComponent, data: { breadcrumb: { alias: "Order Detail" } } }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class OrdersRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component( {
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: [ './order-detail.component.scss' ]
} )
export class OrderDetailComponent implements OnInit {

  order!: IOrder

  constructor( private route: ActivatedRoute, private breadcrumbService: BreadcrumbService, private orderService: OrdersService ) {
    this.breadcrumbService.set( "@OrderDetail", "" )
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get( "id" )
    if ( orderId !== null ) {
      this.orderService.getOrderDetail( +orderId )
        .subscribe( {
          next: ( value: IOrder ) => {
            this.order = value
            this.breadcrumbService.set( "@OrderDetail", `Order status` )
          },
          error: error => console.log( error )
        } )
    }
  }
}

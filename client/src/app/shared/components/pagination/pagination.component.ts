import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: [ './pagination.component.scss' ]
} )
export class PaginationComponent {
  @Input() totalPageCount: number = 0
  @Input() pageSize: number = 0
  @Input() pageNumber: number = 1
  @Output() pageChanged = new EventEmitter<number>()

  onPageChanged( event: any ) {
    this.pageChanged.emit( event.page )
  }
}

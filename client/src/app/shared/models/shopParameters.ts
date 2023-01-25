export class ShopParameters {
  brandId: number = 0
  typeId: number = 0
  sort: string = 'name'
  pageNumber: number = 1
  pageSize: number = 6

  setPageNumber(value?: number) {
    this.pageNumber = value || 1
  }

  setPageSize(value?: number) {
    this.pageSize = value || 6
  }
}
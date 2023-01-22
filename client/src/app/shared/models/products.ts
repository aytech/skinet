import { IProduct } from "./product"

export interface IProducts {
  page: number
  pageSize: number
  count: number
  data: IProduct[]
}
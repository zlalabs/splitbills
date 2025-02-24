import { IListDto } from './list'
import { IMemberDto } from './people'

export interface IBillDto {
  id: string
  link: string
  name?: string
  qrCode?: string
  tips?: number
  tax?: number
  members: IMemberDto[] | undefined
  lists: IListDto[] | undefined
}

export interface ICreateBillDto {
  name?: string
  qrCode?: string
  tips?: number
  tax?: number
  members: IMemberDto[] | undefined
  lists: IListDto[] | undefined
}

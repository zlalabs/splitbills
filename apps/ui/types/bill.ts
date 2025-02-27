import { IListDto, ITmpListDto } from './list'
import { IMemberDto, ITmpMemberDto } from './people'

export interface ITmpBillDto {
  link: string
  name?: string
  qrCode?: string
  tips?: number
  tax?: number
  members: ITmpMemberDto[] | undefined
  lists: ITmpListDto[] | undefined
}

export interface ICreateBillDto {
  name?: string
  qrCode?: string
  tips?: number
  tax?: number
  members: ITmpMemberDto[] | undefined
  lists: ITmpListDto[] | undefined
}

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

export interface IDeleteBillLinkDto {
  id: string
}

export interface IUpdateBillPaidDto {
  id: string
  paid: boolean
}

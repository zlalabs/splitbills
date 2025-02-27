import { IMemberDto, ITmpMemberDto } from './people'

export interface ITmpListDto {
  name: string
  price: number
  order: number
  peoples: string[]
  member?: ITmpMemberDto
}

export interface IListDto {
  id: string
  name: string
  price: number
  order: number
  peoples: IPeopleDto[]
}

export interface IPeopleDto {
  member: IMemberDto
}

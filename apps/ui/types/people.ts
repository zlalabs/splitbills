export interface ITmpPeopleDto {
  name: string
  order: number
}

export interface ITmpMemberDto {
  name: string
  order: number
  paid: boolean
  lists: string[]
}

export interface IMemberDto {
  id: string
  name: string
  order: number
  paid: boolean
}

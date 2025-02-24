export interface IPeopleDto {
  id?: string
  name: string
  order: number
}

export interface IMemberDto {
  id?: string
  name: string
  order: number
  paid: boolean
  lists: string[]
}

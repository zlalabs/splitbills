export class CreateBillDto {
  name?: string
  qrCode?: string
  members: CreateMemberDto[]
  lists: CreateListDto[]
}

export class CreateMemberDto {
  name: string
  peopleId?: string
}

export class CreateListDto {
  name: string
  price: number
  peoples: string[]
}

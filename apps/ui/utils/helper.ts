import { IListDto, ITmpMemberDto, ITmpPeopleDto } from '@/types'

export const transformToSelect = (
  peoples: ITmpPeopleDto[] | undefined,
  members: ITmpMemberDto[] | undefined
) => {
  const indexes = peoples
    ?.map((item) => members?.findIndex((d) => d.name === item.name))
    .filter((index) => index !== -1)

  const transformed = indexes ? Object.fromEntries(indexes.map((index) => [index, true])) : {}

  return transformed
}

export const calTotalPerMember = (name: string, lists: IListDto[] | undefined) => {
  const total: { [key: string]: number } = {}

  lists?.forEach(({ price, peoples }) => {
    const share = price / peoples.length

    peoples.forEach((person) => {
      total[person.member.name] = (total[person.member.name] || 0) + share
    })
  })

  return total[name]?.toFixed(2) || 0
}

import { IMemberDto, IPeopleDto } from '@/types'

export const transformToSelect = (
  peoples: IPeopleDto[] | undefined,
  members: IMemberDto[] | undefined
) => {
  const indexes = peoples
    ?.map((item) => members?.findIndex((d) => d.name === item.name))
    .filter((index) => index !== -1)

  const transformed = indexes ? Object.fromEntries(indexes.map((index) => [index, true])) : {}

  return transformed
}

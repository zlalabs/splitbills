import AvatarPeople from '@/components/avatar/people'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IBillDto } from '@/types'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

type Props = {
  bill: IBillDto | undefined | null
}

export const ListTable: FC<Props> = ({ bill }) => {
  const t = useTranslations()

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">{t('list.name')}</TableHead>
            <TableHead className="text-center">{t('list.price')}</TableHead>
            <TableHead className="text-center">{t('list.price_per_person')}</TableHead>
            <TableHead className="text-center">{t('list.peoples')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bill?.lists?.map((d, i) => (
            <TableRow key={i}>
              <TableCell className="text-center font-medium">{d.name}</TableCell>
              <TableCell className="text-center">{d.price}</TableCell>
              <TableCell className="text-center">
                {d?.peoples.length > 0 || d?.price ? (d?.price / d?.peoples?.length).toFixed(2) : 0}
              </TableCell>
              <TableCell>
                <div className="flex">
                  {d.peoples?.map((p, i) => (
                    <div key={i} className="px-1">
                      <div className="max-w-[80px]">
                        <AvatarPeople name={p.member.name} />
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{t('list.total')}</TableCell>
            <TableCell className="text-right">
              {bill?.lists?.reduce((total, item) => total + (item?.price ?? 0), 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}

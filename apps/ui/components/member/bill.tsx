import { IBillDto } from '@/types'
import { calTotalPerMember } from '@/utils/helper'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type Props = {
  bill: IBillDto | undefined | null
}

export const MemberBill: FC<Props> = ({ bill }) => {
  const t = useTranslations()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{t('member.name')}</TableHead>
          <TableHead>{t('member.price')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bill?.members?.map((member, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{calTotalPerMember(member.name, bill.lists)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

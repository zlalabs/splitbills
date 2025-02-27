import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IBillDto } from '@/types'
import { Banknote } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { Badge } from '../ui/badge'

type Props = {
  bill: IBillDto | undefined | null
  onPaid: (id: string) => void
}

export const MemberTable: FC<Props> = ({ bill, onPaid }) => {
  const t = useTranslations()

  const calTotal = (name: string) => {
    const total: { [key: string]: number } = {}

    bill?.lists?.forEach(({ price, peoples }) => {
      const share = price / peoples.length
      peoples.forEach((person) => {
        total[person.member.name] = (total[person.member.name] || 0) + share
      })
    })

    return total[name]?.toFixed(2)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t('member.name')}</TableHead>
            <TableHead>{t('member.price')}</TableHead>
            <TableHead className="text-right">{t('common.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bill?.members?.map((member, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{calTotal(member.name)}</TableCell>
              <TableCell className="float-right">
                <Badge
                  key={i}
                  variant={member.paid === true ? `default` : `secondary`}
                  className="cursor-pointer"
                  onClick={() => onPaid(member.id)}
                >
                  <div>
                    <Banknote />
                  </div>
                  <div>{member.paid ? t('member.paid') : t('member.not_paid')}</div>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

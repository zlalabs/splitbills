'use client'

import { MemberBill } from '@/components/member/bill'
import { Card, CardContent } from '@/components/ui/card'
import { useGetBillById } from '@/hooks/services/useBill'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { use } from 'react'

export default function BillIdPage({ params }: { params: { link: string } }) {
  const { link } = use(params)
  const t = useTranslations()

  const { data: bill, isLoading } = useGetBillById(link)

  if (isLoading) {
    return (
      <span>
        <Loader2 className="animate-spin" size={50} />
      </span>
    )
  }

  return (
    <>
      <Card className="py-4">
        <CardContent>
          <div className="py-2">
            <p>
              {t('bill.name')} : {bill?.data?.name}
            </p>
            <p>
              {t('people.amount')}: {bill?.data?.members?.reduce((total) => total + 1, 0)}
            </p>
            <p>
              {t('price.total')}:{' '}
              {bill?.data?.lists?.reduce((total, item) => total + (item?.price ?? 0), 0)}
            </p>
          </div>

          <MemberBill bill={bill?.data} />
        </CardContent>
      </Card>
    </>
  )
}

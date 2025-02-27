import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IBillDto } from '@/types'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

type Props = {
  bill: IBillDto | undefined | null
}

export const DashboardView: FC<Props> = ({ bill }) => {
  const t = useTranslations()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {t('bill.name')} : {bill?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <>
            <p>
              {t('people.amount')}: {bill?.members?.reduce((total) => total + 1, 0)}
            </p>
            <p>
              {t('price.total')}:{' '}
              {bill?.lists?.reduce((total, item) => total + (item?.price ?? 0), 0)}
            </p>
          </>
        </CardContent>
      </Card>
    </>
  )
}

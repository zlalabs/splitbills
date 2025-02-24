import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/store'
import { useTranslations } from 'next-intl'

export const DashboardCreate = () => {
  const t = useTranslations()
  const { tmpBill, updateTmpBill } = useAppStore()

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    updateTmpBill({
      ...tmpBill!,
      name: name,
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              placeholder={t('bill.name')}
              onChange={handleOnChangeName}
              defaultValue={tmpBill?.name}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <>
            <p>
              {t('people.amount')}: {tmpBill?.members?.reduce((total) => total + 1, 0)}
            </p>
            <p>
              {t('price.total')}:{' '}
              {tmpBill?.lists?.reduce((total, item) => total + (item?.price ?? 0), 0)}
            </p>
          </>
        </CardContent>
      </Card>
    </>
  )
}

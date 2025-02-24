'use client'

import { PeopleList } from '@/components/people/list'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/store'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const t = useTranslations()

  const { tmpBill, updateTmpBill } = useAppStore()

  const handleOnCreate = () => {
    updateTmpBill({
      ...tmpBill!,
      lists: [],
    })
    router.push('/create')
  }

  const a = () => {}

  return (
    <div>
      <div className="container mx-auto">
        <div className="py-2">
          <PeopleList />
        </div>

        <div className="py-2">
          <Button className="w-full text-lg rounded-full " onClick={handleOnCreate}>
            {t('bill.create')}
          </Button>
        </div>
      </div>
    </div>
  )
}

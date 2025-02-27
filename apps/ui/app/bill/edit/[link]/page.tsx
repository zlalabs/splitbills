'use client'

import { DashboardView } from '@/components/dashboard/view'
import { ListTable } from '@/components/list/table'
import { MemberTable } from '@/components/member/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetBillById, useUpdateBillPaid } from '@/hooks/services/useBill'
import { IBillDto } from '@/types'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { use, useEffect, useState } from 'react'

export default function EditPage({ params }: { params: { link: string } }) {
  const t = useTranslations()

  const { link } = use(params)
  const { data: bill, isLoading } = useGetBillById(link)
  const updateBillPaid = useUpdateBillPaid()

  const [data, setData] = useState<IBillDto | undefined | null>()
  const [tab, setTab] = useState<string>('list')

  useEffect(() => {
    setData(bill?.data)
  }, [isLoading])

  const handleOnPaid = async (id: string) => {
    const members = data?.members?.map((member) => {
      if (member.id === id) {
        return {
          ...member,
          paid: !member.paid,
        }
      }
      return member
    })
    setData({
      ...data!,
      members: members,
    })

    const user = data?.members?.find((member) => member.id === id)

    updateBillPaid.mutate({
      link: link,
      data: {
        id: user!.id,
        paid: !user!.paid,
      }!,
    })
  }

  if (isLoading) {
    return (
      <span>
        <Loader2 className="animate-spin" size={50} />
      </span>
    )
  }

  return (
    <>
      <DashboardView bill={data} />

      <Tabs defaultValue={tab} className="w-full py-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger onClick={() => setTab('list')} value="list">
            {t('common.list')}
          </TabsTrigger>
          <TabsTrigger onClick={() => setTab('member')} value="member">
            {t('member.list')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ListTable bill={data} />
        </TabsContent>
        <TabsContent value="member">
          <MemberTable bill={data} onPaid={handleOnPaid} />
        </TabsContent>
      </Tabs>
    </>
  )
}

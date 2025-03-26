'use client'

import { ModalDeleteConfirm } from '@/components/modal/modal-delete'
import { PeopleList } from '@/components/people/list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDeleteBillByLink } from '@/hooks/services/useBill'
import { useAppStore } from '@/hooks/store'
import { IBillDto } from '@/types'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const t = useTranslations()
  const { bills, removeBill } = useAppStore()

  const deleteBillByLinkService = useDeleteBillByLink()

  const [openDelete, setOpenDelete] = useState(false)
  const [bill, setBill] = useState<IBillDto | undefined>()

  const handleOnCreate = () => {
    router.push('/bill/create')
  }

  const handleOnOpenDelete = (data: IBillDto) => {
    setOpenDelete(true)
    setBill(data)
  }

  const handleOnConfirmDelete = () => {
    deleteBillByLinkService.mutate(
      {
        data: bill!,
        link: bill!.link,
      },
      {
        onSuccess: async () => {
          removeBill(bill!.id)
          setOpenDelete(false)
          setBill(undefined)
        },
        onError: (error) => {
          if ((error as AxiosError).status === 404) {
            removeBill(bill!.id)
          }
          setOpenDelete(false)
          setBill(undefined)
        },
      }
    )
  }

  const handleOnCancelDelete = () => {
    setOpenDelete(false)
    setBill(undefined)
  }

  return (
    <>
      <div>
        <div className="container mx-auto">
          <div className="py-2 grid sx:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {bills?.map((bill, i) => (
              <Card key={i} className="my-2 cursor-pointer py-4">
                <CardContent>
                  <div onClick={() => router.push(`/bill/${bill.link}`)}>
                    <p>
                      {t('bill.name')} : {bill.name ? bill.name : '-'}
                    </p>

                    <p>
                      {t('common.price')} :{' '}
                      {bill.lists?.reduce((total, item) => total + item.price, 0)}
                    </p>
                  </div>
                  <p className="float-right bottom-0">
                    <Button
                      className="mr-2 cursor-pointer"
                      variant={'secondary'}
                      onClick={() => router.push(`/bill/edit/${bill.link}`)}
                    >
                      {t('common.update')}
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant={'destructive'}
                      onClick={() => handleOnOpenDelete(bill)}
                    >
                      {t('common.delete')}
                    </Button>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="py-2">
            <PeopleList />
          </div>

          <div className="py-2">
            <Button className="w-full text-lg rounded-full cursor-pointer" onClick={handleOnCreate}>
              {t('bill.create')}
            </Button>
          </div>
        </div>
      </div>

      <ModalDeleteConfirm
        open={openDelete}
        title={t('common.confirm_delete')}
        onConfirm={handleOnConfirmDelete}
        onCancel={handleOnCancelDelete}
      >
        {t('common.confirm_delete')} : {bill?.name && bill.name}
      </ModalDeleteConfirm>
    </>
  )
}

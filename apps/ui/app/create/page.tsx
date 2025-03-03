'use client'

import { DashboardCreate } from '@/components/dashboard/create'
import { TmpListTable } from '@/components/list/tmp-table'
import { TmpMemberTable } from '@/components/member/tmp-table'
import { ModalList } from '@/components/modal/list'
import { PeopleList } from '@/components/people/list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateBill } from '@/hooks/services/useBill'
import { useAppStore } from '@/store/store'
import { ICreateBillDto, ITmpListDto, ITmpMemberDto } from '@/types'
import { MODE } from '@/utils/constant'
import { List, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreatePage() {
  const t = useTranslations()
  const router = useRouter()
  const { updateTmpBill, tmpBill, createBill } = useAppStore()
  const createBillService = useCreateBill()

  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<string>('list')
  const [mode, setMode] = useState<string | undefined>()
  const [openList, setOpenList] = useState<boolean>(false)
  const [listIdx, setListIdx] = useState<number>()
  const [list, setList] = useState<ITmpListDto | undefined>()
  const [member, setMember] = useState<ITmpMemberDto | undefined>()

  const handleOnSubmit = async () => {
    setLoading(true)
    createBillService.mutate(
      {
        data: tmpBill!,
      },
      {
        onSuccess: async (res) => {
          const data = await res.data
          createBill(data as ICreateBillDto)
          updateTmpBill({
            ...tmpBill!,
            name: undefined,
            members: [],
            lists: [],
          })
          return router.push(`/bill/${data?.link}`)
        },
      }
    )
  }

  const handleOnChangeList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if (name?.trim() === '') return
    const lastOrder = tmpBill?.lists?.reduce(
      (max, list) => (list.order > max ? list.order : max),
      0
    )
    setList({
      name: name,
      price: 0,
      order: lastOrder ? lastOrder + 1 : 1,
      peoples: [],
    })
  }

  const handleOnAddList = () => {
    handleOnCreateList()
  }

  const handleOnEnterList = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && list?.name?.trim() !== '') {
      handleOnCreateList()
    }
  }

  const handleOnCreateList = () => {
    setOpenList(true)
    setMode(MODE.CREATE)
  }

  const handleOpenList = () => {
    setMode(MODE.EDIT)
    setOpenList(!openList)
  }

  const handleChangeDataList = (data: ITmpListDto) => {
    setList(data)
  }

  const handleOnEditList = (index: number) => {
    const data = tmpBill?.lists?.find((d, i) => i === index)
    setListIdx(index)
    setList(data)
    setOpenList(true)
  }

  const handleSubmitList = () => {
    if (list) {
      if (mode === MODE.CREATE) {
        updateTmpBill({
          ...tmpBill!,
          lists: (tmpBill?.lists ?? []).concat(list),
        })
      } else if (MODE.EDIT) {
        const update = tmpBill?.lists?.map((x, i) => {
          if (i === listIdx) {
            return list
          }
          return x
        })

        updateTmpBill({
          ...tmpBill!,
          lists: update!,
        })
      }
      setList(undefined)
      setListIdx(undefined)
      setMember(undefined)
    }
  }

  const handleOnChangeMember = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if (name?.trim() === '') return
    const lastOrder = tmpBill?.members?.reduce(
      (max, list) => (list.order > max ? list.order : max),
      0
    )

    setMember({
      name: name,
      order: lastOrder ? lastOrder + 1 : 1,
      paid: false,
      lists: [],
    })
  }

  const handleOnEnterMember = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && list?.name?.trim() !== '') {
      handleOnCreateMember()
    }
  }

  const handleOnCreateMember = () => {
    if (member) {
      updateTmpBill({
        ...tmpBill!,
        members: (tmpBill?.members ?? []).concat(member!),
      })

      setList(undefined)
      setListIdx(undefined)
      setMember(undefined)
    }
  }

  return (
    <>
      <DashboardCreate />
      <PeopleList />

      <div className="py-4">
        <>
          {tab === 'list' ? (
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder={t('list.name')}
                defaultValue={list?.name ?? ''}
                value={list?.name ?? ''}
                onChange={handleOnChangeList}
                onKeyDown={handleOnEnterList}
              />
              <Button onClick={handleOnAddList}>
                <List />
                {t('common.add_list')}
              </Button>
            </div>
          ) : (
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder={t('member.name')}
                defaultValue={member?.name ?? ''}
                value={member?.name ?? ''}
                onChange={handleOnChangeMember}
                onKeyDown={handleOnEnterMember}
              />
              <Button onClick={handleOnCreateMember}>
                <List />
                {t('common.add_member')}
              </Button>
            </div>
          )}
        </>
      </div>

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
          <TmpListTable onEdit={handleOnEditList} />
        </TabsContent>
        <TabsContent value="member">
          <TmpMemberTable />
        </TabsContent>
      </Tabs>

      <ModalList
        mode={mode ?? ''}
        isOpen={openList}
        onOpen={handleOpenList}
        list={list}
        onChangeData={handleChangeDataList}
        onSubmit={handleSubmitList}
      />

      <Button
        className="w-full text-lg rounded-full my-4"
        onClick={handleOnSubmit}
        disabled={loading && true}
      >
        {loading && (
          <span>
            <Loader2 className="animate-spin" size={50} />
          </span>
        )}
        {t('bill.create')}
      </Button>
    </>
  )
}

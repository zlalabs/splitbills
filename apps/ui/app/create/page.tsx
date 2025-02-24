'use client'

import { DashboardCreate } from '@/components/dashboard/create'
import { ListTable } from '@/components/list/table'
import { MemberTable } from '@/components/member/table'
import { ModalList } from '@/components/modal/list'
import { PeopleList } from '@/components/people/list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/store/store'
import { IListDto, IMemberDto } from '@/types'
import { MODE } from '@/utils/constant'
import { List, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function CreatePage() {
  const t = useTranslations()
  const { updateTmpBill, tmpBill } = useAppStore()

  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<string>('list')
  const [mode, setMode] = useState<string | undefined>()
  const [openList, setOpenList] = useState<boolean>(false)
  const [openListDelete, setOpenListDelete] = useState<boolean>(false)
  const [listIdx, setListIdx] = useState<number>()
  const [list, setList] = useState<IListDto | undefined>()
  const [openMember, setOpenMember] = useState<boolean>(false)
  const [openCheckList, setOpenCheckList] = useState<boolean>(false)
  const [member, setMember] = useState<IMemberDto | undefined>()
  const [openMemberDelete, setOpenMemberDelete] = useState<boolean>(false)
  const [memberIdx, setMemberIdx] = useState<number>()

  useEffect(() => {
    handleInitTmpBil()
  }, [])

  const handleInitTmpBil = () => {}

  const handleOnSubmit = () => {
    setLoading(true)
  }

  const handleList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if (name?.trim() === '') return
    const lastOrder = tmpBill!.lists!.reduce(
      (max, list) => (list.order > max ? list.order : max),
      0
    )
    setList({
      name: name,
      price: 0,
      order: lastOrder + 1,
      peoples: [],
    })
  }

  const handleAddList = () => {
    handleOnCreateList()
  }

  const handleEnterList = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && list?.name?.trim() !== '') {
      handleOnCreateList()
    }
  }

  const handleOnCreateList = () => {
    setOpenList(true)
    setMode('create')
  }

  const handleOpenList = () => {
    setMode(MODE.EDIT)
    setOpenList(!openList)
  }

  const handleChangeDataList = (data: IListDto) => {
    setList(data)
  }

  const handleEditList = (index: number) => {
    const data = tmpBill?.lists?.find((d, i) => i === index)
    setListIdx(index)
    setList(data)
    setOpenList(true)
  }

  const handleDeleteList = (index: number) => {
    const data = tmpBill?.lists?.find((d, i) => i === index)
    setListIdx(index)
    setList(data)
    setOpenListDelete(true)
  }

  const handleSubmitList = () => {
    if (list) {
      if (mode === MODE.CREATE) {
        updateTmpBill({
          ...tmpBill!,
          lists: (tmpBill?.lists ?? []).concat(list),
        })
      } else {
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
    }
  }

  const handleConfirmDeleteList = () => {
    const update = tmpBill?.lists?.filter((x, i) => i !== listIdx)
    updateTmpBill({
      ...tmpBill!,
      lists: update!,
    })
    setOpenListDelete(false)
    setList(undefined)
    setListIdx(undefined)
  }

  const handleCancelDeleteList = () => {
    setOpenListDelete(false)
  }

  const handleOnOpenEditMember = (index: number) => {
    setOpenMember(true)
    const user = tmpBill?.members?.find((x, i) => i === index)
    setMember(user)
    setMemberIdx(index)
  }

  const handleOnOpenCheckList = (index: number) => {
    setOpenCheckList(true)
    const user = tmpBill?.members?.find((x, i) => i === index)
    setMember(user)
  }

  const handleOnCloseCheckList = () => {
    setOpenCheckList(false)
  }

  // @Todo
  const handleOnConfirmEditMember = (data: IMemberDto) => {
    const update = tmpBill?.members?.map((m, index) => {
      if (index === memberIdx) {
        return {
          ...data,
        }
      }
      return m
    })

    updateTmpBill({
      ...tmpBill!,
      members: update!,
    })
    setOpenMember(false)
    setMember(undefined)
  }

  const handleOnCancelEdiMember = () => {
    setOpenMember(false)
    setMember(undefined)
  }

  const handleOnCheckMenu = (listIndex: number) => {
    const user = tmpBill?.members?.find((m) => m.id === member!.id)
    const updated = tmpBill?.lists?.map((l, i) => {
      if (i === listIndex) {
        const check = l.peoples.filter((p) => p === user?.name)
        const p =
          check.length > 0
            ? l.peoples.filter((name) => name !== user!.name)
            : l.peoples.concat(user!.name)

        return {
          ...l,
          peoples: p,
        }
      }
      return l
    })

    updateTmpBill({
      ...tmpBill!,
      lists: updated,
    })
  }

  const handleDeleteMember = (index: number) => {
    const data = tmpBill?.members?.find((d, i) => i === index)
    setMemberIdx(index)
    setMember(data)
    setOpenMemberDelete(true)
  }

  const handleCancelDeleteMember = () => {
    setOpenMemberDelete(false)
  }

  const handleConfirmDeleteMember = () => {
    const data = tmpBill?.members?.filter((d, i) => i !== memberIdx)
    updateTmpBill({
      ...tmpBill!,
      members: data,
    })
    setOpenMemberDelete(false)
    setMember(undefined)
  }

  return (
    <>
      <DashboardCreate />
      <PeopleList />

      <div className="py-4">
        <>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder={t('list.name')}
              defaultValue={list?.name ?? ''}
              value={list?.name ?? ''}
              onChange={handleList}
              onKeyDown={handleEnterList}
            />
            <Button onClick={handleAddList}>
              <List />
              {t('common.add')}
            </Button>
          </div>
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
          <ListTable
            list={list}
            lists={tmpBill?.lists}
            onEdit={handleEditList}
            openDelete={openListDelete}
            onDelete={handleDeleteList}
            onConfirmDelete={handleConfirmDeleteList}
            onCancelDelete={handleCancelDeleteList}
          />
        </TabsContent>
        <TabsContent value="member">
          <MemberTable
            lists={tmpBill?.lists}
            openEdit={openMember}
            openCheckList={openCheckList}
            members={tmpBill?.members}
            member={member}
            onOpenEdit={handleOnOpenEditMember}
            onConfirmEdit={handleOnConfirmEditMember}
            onOpenCheckList={handleOnOpenCheckList}
            onCancelEdit={handleOnCancelEdiMember}
            onCloseCheckList={handleOnCloseCheckList}
            onCheckMenu={handleOnCheckMenu}
            onDelete={handleDeleteMember}
            openDelete={openMemberDelete}
            onCancelDelete={handleCancelDeleteMember}
            onConfirmDelete={handleConfirmDeleteMember}
          />
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

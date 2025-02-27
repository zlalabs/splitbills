import { ModalCheckList } from '@/components/member/modal-check-list'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/store'
import { ITmpMemberDto } from '@/types'
import { List, Pen, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { ModalDeleteConfirm } from '../modal/modal-delete'
import { ModalMemberEdit } from './modal-edit'

export const TmpMemberTable: FC = () => {
  const t = useTranslations()
  const { tmpBill, updateTmpBill } = useAppStore()

  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openCheckList, setOpenCheckList] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [memberIdx, setMemberIdx] = useState<number>()
  const [member, setMember] = useState<ITmpMemberDto | undefined>()

  const handleConfirmEdit = (data: ITmpMemberDto) => {
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
    setOpenEdit(false)
    setMember(undefined)
    setMemberIdx(undefined)
  }

  const handleOnCancelEdiMember = () => {
    setOpenEdit(false)
    setMember(undefined)
    setMemberIdx(undefined)
  }

  const handleOnCheckMenu = (index: number) => {
    const user = tmpBill?.members?.find((_, idx) => idx === memberIdx)

    const updated = tmpBill?.lists?.map((l, i) => {
      if (i === index) {
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

  const handleOnOpenEditMember = (index: number) => {
    setOpenEdit(true)
    const user = tmpBill?.members?.find((x, i) => i === index)
    setMember(user)
    setMemberIdx(index)
  }

  const handleOnOpenCheckList = (index: number) => {
    setOpenCheckList(true)
    setMemberIdx(index)
    const user = tmpBill?.members?.find((x, i) => i === index)
    setMember(user)
  }

  const handleOnCloseCheckList = () => {
    setOpenCheckList(false)
    setMember(undefined)
    setMemberIdx(undefined)
  }

  const handleOnOpenDelete = (index: number) => {
    setMemberIdx(index)
    setOpenDelete(true)
  }

  const handleCancelDelete = () => {
    setOpenDelete(false)
    setMember(undefined)
    setMemberIdx(undefined)
  }

  const handleConfirmDelete = () => {
    const data = tmpBill?.members?.filter((d, i) => i !== memberIdx)
    updateTmpBill({
      ...tmpBill!,
      members: data,
    })
    setOpenDelete(false)
    setMember(undefined)
    setMemberIdx(undefined)
  }

  const calTotal = (name: string) => {
    const total: { [key: string]: number } = {}

    tmpBill?.lists?.forEach(({ price, peoples }) => {
      const share = price / peoples.length
      peoples.forEach((person) => {
        total[person] = (total[person] || 0) + share
      })
    })

    return total[name]?.toFixed(2)
  }

  const ConfirmDelete = () => {
    const data = tmpBill?.members?.find((d, i) => i === memberIdx)
    return (
      <>
        {t('common.list')} : {data?.name}
      </>
    )
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
          {tmpBill?.members?.map((member, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{calTotal(member.name)}</TableCell>
              <TableCell className="grid grid-cols-3 float-right">
                <div className="p-2">
                  <Pen className="cursor-pointer" onClick={() => handleOnOpenEditMember(i)} />
                </div>
                <div className="p-2">
                  <List className="cursor-pointer" onClick={() => handleOnOpenCheckList(i)} />
                </div>
                <div className="p-2">
                  <Trash2 className="cursor-pointer" onClick={() => handleOnOpenDelete(i)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ModalCheckList
        lists={tmpBill?.lists}
        open={openCheckList}
        onClose={handleOnCloseCheckList}
        member={member}
        onCheckMenu={handleOnCheckMenu}
      />

      <ModalMemberEdit
        member={member}
        open={openEdit}
        onCancel={handleOnCancelEdiMember}
        onConfirm={handleConfirmEdit}
      />

      <ModalDeleteConfirm
        title={`${t('common.confirm_delete')}`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        open={openDelete}
      >
        <ConfirmDelete />
      </ModalDeleteConfirm>
    </>
  )
}

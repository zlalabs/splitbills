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
import { IListDto, IMemberDto } from '@/types'
import { List, Pen, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { ModalDeleteConfirm } from '../modal/modal-delete'
import { ModalMemberEdit } from './modal-edit'

type Props = {
  lists: IListDto[] | undefined
  openEdit: boolean
  onOpenEdit: (index: number) => void
  onCancelEdit: () => void
  onConfirmEdit: () => void
  openCheckList: boolean
  members: IMemberDto[] | undefined
  member: IMemberDto | undefined
  onOpenCheckList: (index: number) => void
  onCloseCheckList: () => void
  onCheckMenu: (index: number) => void
  openDelete: boolean
  onDelete: (id: number) => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
}

export const MemberTable: FC<Props> = ({
  lists,
  openEdit,
  onOpenEdit,
  onCancelEdit,
  onConfirmEdit,
  openCheckList,
  members,
  member,
  onOpenCheckList,
  onCloseCheckList,
  onCheckMenu,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  openDelete,
}) => {
  const t = useTranslations()
  const { tmpBill } = useAppStore()

  const handleOnOpenDelete = (id: number) => {
    onDelete(id)
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
    return (
      <>
        {t('common.list')} : {member?.name}
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
            <TableHead>{t('member.status')}</TableHead>
            <TableHead className="text-right">{t('common.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members?.map((member, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{calTotal(member.name)}</TableCell>
              <TableCell>{member.paid ? 'paid' : 'unpaid'}</TableCell>
              <TableCell className="grid grid-cols-3 float-right">
                <div className="p-2">
                  <Pen className="cursor-pointer" onClick={() => onOpenEdit(i)} />
                </div>
                <div className="p-2">
                  <List className="cursor-pointer" onClick={() => onOpenCheckList(i)} />
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
        lists={lists}
        open={openCheckList}
        onClose={onCloseCheckList}
        member={member}
        onCheckMenu={onCheckMenu}
      />

      <ModalMemberEdit
        member={member}
        open={openEdit}
        onCancel={onCancelEdit}
        onConfirm={onConfirmEdit}
      />

      <ModalDeleteConfirm
        title={`${t('common.confirm_delete')}`}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        open={openDelete}
      >
        <ConfirmDelete />
      </ModalDeleteConfirm>
    </>
  )
}

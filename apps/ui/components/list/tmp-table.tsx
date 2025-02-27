import AvatarPeople from '@/components/avatar/people'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/store'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { ModalDeleteConfirm } from '../modal/modal-delete'

type Props = {
  onEdit: (id: number) => void
}

export const TmpListTable: FC<Props> = ({ onEdit }) => {
  const t = useTranslations()
  const { tmpBill, updateTmpBill } = useAppStore()

  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [listIdx, setListIdx] = useState<number>()

  const ConfirmDelete = () => {
    const data = tmpBill?.lists?.find((d, i) => i === listIdx)
    return (
      <>
        {t('common.list')} : {data?.name}
      </>
    )
  }

  const handleOnEdit = (id: number) => {
    onEdit(id)
  }

  const handleOnDelete = (index: number) => {
    setListIdx(index)
    setOpenDelete(true)
  }

  const handleConfirmDeleteList = () => {
    const update = tmpBill?.lists?.filter((x, i) => i !== listIdx)
    updateTmpBill({
      ...tmpBill!,
      lists: update!,
    })
    setOpenDelete(false)
    setListIdx(undefined)
  }

  const handleCancelDeleteList = () => {
    setOpenDelete(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">{t('list.name')}</TableHead>
            <TableHead className="text-center">{t('list.price')}</TableHead>
            <TableHead className="text-center">{t('list.price_per_person')}</TableHead>
            <TableHead className="text-center">{t('list.peoples')}</TableHead>
            <TableHead className="text-right">{t('common.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tmpBill?.lists?.map((d, i) => (
            <TableRow key={i}>
              <TableCell className="text-center font-medium">{d.name}</TableCell>
              <TableCell className="text-center">{d.price}</TableCell>
              <TableCell className="text-center">
                {d?.peoples.length > 0 || d?.price ? (d?.price / d?.peoples?.length).toFixed(2) : 0}
              </TableCell>
              <TableCell>
                <div className="flex">
                  {d.peoples?.map((p, i) => (
                    <div key={i} className="px-1">
                      <div className="max-w-[80px]">
                        <AvatarPeople name={p} />
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="grid grid-cols-2 float-right">
                <div className="p-2">
                  <Pencil className="cursor-pointer" onClick={() => handleOnEdit(i)} />
                </div>
                <div className="p-2">
                  <Trash2 className="cursor-pointer" onClick={() => handleOnDelete(i)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{t('list.total')}</TableCell>
            <TableCell className="text-right">
              {tmpBill?.lists?.reduce((total, item) => total + (item?.price ?? 0), 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <ModalDeleteConfirm
        title={`${t('common.confirm_delete')}`}
        onConfirm={handleConfirmDeleteList}
        onCancel={handleCancelDeleteList}
        open={openDelete}
      >
        <ConfirmDelete />
      </ModalDeleteConfirm>
    </>
  )
}

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
import { IListDto } from '@/types/list'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { ModalDeleteConfirm } from '../modal/modal-delete'

type Props = {
  list: IListDto | undefined
  lists: IListDto[] | undefined
  onEdit: (id: number) => void
  openDelete: boolean
  onDelete: (id: number) => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
}

export const ListTable: FC<Props> = ({
  list,
  lists,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  openDelete,
}) => {
  const t = useTranslations()

  const ConfirmDelete = () => {
    return (
      <>
        {t('common.list')} : {list?.name}
      </>
    )
  }

  const handleOnEdit = (id: number) => {
    onEdit(id)
  }

  const handleOnOpenDelete = (id: number) => {
    onDelete(id)
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
          {lists?.map((d, i) => (
            <TableRow key={i}>
              <TableCell className="text-center font-medium">{d.name}</TableCell>
              <TableCell className="text-center">{d.price}</TableCell>
              <TableCell className="text-center">
                {(d.price / d.peoples.length)?.toFixed(2)}
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
                  <Trash2 className="cursor-pointer" onClick={() => handleOnOpenDelete(i)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{t('list.total')}</TableCell>
            <TableCell className="text-right">
              {lists?.reduce((total, item) => total + (item?.price ?? 0), 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

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

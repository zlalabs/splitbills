import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IListDto, IMemberDto } from '@/types'
import { Check, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  lists: IListDto[] | undefined
  member: IMemberDto | undefined
  onCheckMenu: (index: number) => void
}

export const ModalCheckList: FC<Props> = ({ open, member, onClose, lists, onCheckMenu }) => {
  const t = useTranslations()

  const handleOnCheckMenu = (index: number) => {
    onCheckMenu(index)
  }

  return (
    <>
      <Drawer open={open}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{member?.name}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <ScrollArea className="h-72 rounded-md border">
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('member.name')}</TableHead>
                    <TableHead>{t('member.price')}</TableHead>
                    <TableHead>{t('member.pay')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists?.map((list, index) => {
                    const total = list.price / list.peoples?.length || 0
                    const paid = list.peoples?.find((p) => p === member?.name)

                    return (
                      <TableRow
                        key={index}
                        className={`${paid && 'text-blue-500'} cursor-pointer`}
                        onClick={() => handleOnCheckMenu(index)}
                      >
                        <TableCell>
                          <div className="flex">
                            <div className="p-2">
                              {list.peoples?.find((p) => p === member?.name) ? <Check /> : <Plus />}
                            </div>
                            <div className={`p-2`}>{list.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{list.price}</TableCell>
                        <TableCell>{total?.toFixed(2)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <DrawerFooter>
            <Button onClick={onClose}>{t('common.ok')}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* <ModalDeleteConfirm
        title={`${t('common.confirm_delete')}`}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        open={openDelete}
      >
        <ConfirmDelete />
      </ModalDeleteConfirm> */}
    </>
  )
}

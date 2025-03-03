import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/store'
import { ITmpListDto } from '@/types'
import { ITmpMemberDto, ITmpPeopleDto } from '@/types/people'
import { transformToSelect } from '@/utils/helper'
import { CheckedState } from '@radix-ui/react-checkbox'
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Check, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  onOpen: (status: boolean) => void
}

export const ModalPeople: FC<Props> = ({ isOpen, onOpen }) => {
  const t = useTranslations()
  const { createPeople, removePeople, peoples, tmpBill, loading, setLoading, updateTmpBill } =
    useAppStore()
  const [name, setName] = useState<string | undefined>()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const data = transformToSelect(peoples, tmpBill?.members)

    setRowSelection(data)
    setLoading(false)
  }, [loading, peoples, setLoading, tmpBill?.members])

  const handleOnCheckMember = (data: ITmpMemberDto[]) => {
    const names = data.map((d) => d.name)
    const lists: ITmpListDto[] | undefined = tmpBill?.lists?.map((list) => {
      const result: ITmpListDto = {
        ...list,
        peoples: list?.peoples?.filter((person) => names.includes(person)),
      }

      return result
    })

    const members = tmpBill?.members?.concat(data)

    const seen = new Set()
    const uniqueMembers = members?.filter((member) => {
      if (seen.has(member.name)) {
        return false
      }
      seen.add(member.name)
      return true
    })

    updateTmpBill({
      ...tmpBill!,
      members: uniqueMembers,
      lists: lists,
    })
  }

  const handleCreatePeople = () => {
    if (name?.trim() === '') return
    onAddPeople()
  }

  const handleEnterName = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setError(false)
    if (event.key === 'Enter' && name?.trim() !== '') {
      onAddPeople()
    }
  }

  const onAddPeople = () => {
    setError(false)
    const lastOrder = peoples?.reduce(
      (max, person) => (person?.order > max ? person?.order : max),
      0
    )

    const check = peoples?.find((p) => p?.name?.toLowerCase() === name?.toLowerCase())
    if (check) {
      setError(true)
      return
    }

    const people: ITmpPeopleDto = {
      name: name!,
      order: lastOrder + 1,
    }
    createPeople(people)
    setName('')
  }

  const handleRemovePeople = (index: number) => {
    removePeople(index)
  }

  const onSelectChange = (index: number, value: CheckedState) => {
    const data = table.getState().rowSelection
    const updateData: RowSelectionState = { ...data, [index]: value }
    const filterPeoples = Object.keys(updateData)
      ?.map(Number)
      ?.filter((index) => updateData[index])
      ?.map((index) => peoples[index])
      ?.filter(Boolean)
      ?.map((people) => {
        return people as ITmpMemberDto
      })

    handleOnCheckMember(filterPeoples)
  }

  const columns: ColumnDef<ITmpPeopleDto>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            onSelectChange(row.index, !!value)
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Trash2
            className="cursor-pointer"
            onClick={() => handleRemovePeople(row.original.order - 1)}
          />
        )
      },
    },
  ]

  const table = useReactTable({
    data: peoples,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onOpen(!isOpen)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('people.list')}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 p-2 rounded-md w-full max-w-sm">
              <Input
                type="text"
                placeholder={t('people.enter_name')}
                value={name}
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleEnterName}
                className={`flex-1 ${error ? 'border-rose-500' : null}`}
              />

              {name?.trim() !== '' && !error && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCreatePeople()}
                  className="p-2 hover:bg-green-200 rounded-full"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="w-full">
              <div className="w-full rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => onOpen(false)}>
              {t('common.done')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

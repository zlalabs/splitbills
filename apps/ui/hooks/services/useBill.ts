import { createBill, deleteBillByLink, getBillByLink, updateBillPaid } from '@/services/bill'
import { ICreateBillDto, IDeleteBillLinkDto, IUpdateBillPaidDto } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateBill = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ICreateBillDto }) => createBill(data),
  })
}

export const useGetBillById = (link: string) => {
  return useQuery({
    queryKey: ['getBillByLink', link],
    queryFn: () => getBillByLink(link),
  })
}

export const useUpdateBillPaid = () => {
  return useMutation({
    mutationFn: ({ data, link }: { data: IUpdateBillPaidDto; link: string }) =>
      updateBillPaid(link, data),
  })
}

export const useDeleteBillByLink = () => {
  return useMutation({
    mutationFn: ({ data, link }: { data: IDeleteBillLinkDto; link: string }) =>
      deleteBillByLink(link, data),
  })
}

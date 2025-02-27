import { IBillDto, ICreateBillDto, IDeleteBillLinkDto, IUpdateBillPaidDto } from '@/types/bill'
import { IResponseData } from '@/types/response'
import api from './api'

export const createBill = async (data: ICreateBillDto): Promise<IResponseData<IBillDto>> => {
  const res = await api.post(`/v1/anonymous/bills`, data)
  return res.data
}

export const getBillByLink = async (link: string): Promise<IResponseData<IBillDto>> => {
  const res = await api.get(`/v1/anonymous/bills/link/${link}`)
  return res.data
}

export const updateBillPaid = async (
  link: string,
  data: IUpdateBillPaidDto
): Promise<IResponseData<IBillDto>> => {
  const res = await api.patch(`/v1/anonymous/bills/link/${link}`, data)
  return res.data
}

export const deleteBillByLink = async (
  link: string,
  data: IDeleteBillLinkDto
): Promise<IResponseData<string>> => {
  const res = await api.post(`/v1/anonymous/bills/link/${link}`, data)
  return res.data
}

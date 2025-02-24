import { IBillDto, ICreateBillDto } from '@/types/bill'
import { IResponseData } from '@/types/response'
import api from './api'

export const createBill = async (data: ICreateBillDto): Promise<IResponseData<IBillDto>> => {
  const res = await api.post(`/v1/anonymous/bills`, data)
  return res.data
}

export const getAllBills = () => {}

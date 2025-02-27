import { IBillDto, ICreateBillDto } from '@/types'
import { IStoreState } from '@/types/store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const localStorageName = 'budgmate_sharebill'

export const useAppStore = create<IStoreState>()(
  persist(
    (set) => ({
      loading: true,
      setLoading: (status: boolean) =>
        set(() => ({
          loading: status,
        })),
      bills: [],
      createBill: (data: ICreateBillDto) =>
        set((state) => ({
          bills: state.bills.concat(data as IBillDto),
        })),
      removeBill: (id) => set((state) => ({ bills: state.bills.filter((x) => x.id != id) })),
      peoples: [],
      createPeople: (data) =>
        set((state) => ({
          peoples: state.peoples.concat(data),
        })),
      updatePeople: (index, data) =>
        set((state) => ({
          peoples: state.peoples.map((people, idx) => {
            if (idx === index) {
              return {
                ...people,
                ...data,
              }
            }
            return people
          }),
        })),
      removePeople: (index) =>
        set((state) => ({ peoples: state.peoples.filter((x, idx) => idx !== index) })),
      tmpBill: undefined,
      updateTmpBill: (data) =>
        set(() => ({
          tmpBill: { ...data },
        })),
      clearTmpBill: () =>
        set(() => ({
          tmpBill: undefined,
        })),
    }),
    {
      name: localStorageName,
    }
  )
)

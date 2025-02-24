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
      createBill: (data) =>
        set((state) => ({
          bills: state.bills.concat(data),
        })),
      removeBill: (id) => set((state) => ({ bills: state.bills.filter((x) => x.id != id) })),
      peoples: [],
      createPeople: (data) =>
        set((state) => ({
          peoples: state.peoples.concat(data),
        })),
      updatePeople: (id, data) =>
        set((state) => ({
          peoples: state.peoples.map((people) => {
            if (people.id === id) {
              return {
                ...people,
                ...data,
              }
            }
            return people
          }),
        })),
      removePeople: (id) => set((state) => ({ peoples: state.peoples.filter((x) => x.id != id) })),
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

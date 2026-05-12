import { create } from 'zustand'

export const useUiStore = create((set) => ({
    sideBarOpen: false,
    toggleSideBar: () => set((state: { sideBarOpen: boolean; }) => ({ sideBarOpen: !state.sideBarOpen})),
    setSideBar: (value:boolean) => set({ sideBarOpen: value }),

}))

import { create } from 'zustand'

interface UiState {
    sideBarOpen: boolean;
    toggleSideBar: () => void;
    setSideBar: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
    sideBarOpen: false,
    toggleSideBar: () => set((state) => ({ sideBarOpen: !state.sideBarOpen })),
    setSideBar: (value: boolean) => set({ sideBarOpen: value }),
}))

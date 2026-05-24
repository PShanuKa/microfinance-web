import { create } from 'zustand'
import React from 'react';

export type DialogType = "success" | "error" | "info" | "confirmation" | "approve" | "delete";

interface DialogState {
    open: boolean;
    type: DialogType;
    title : string;
    message : string;
    content?: React.ReactNode;
    onConfirm?: (value?: string) => void;
    setOpen: (value: {open: boolean, type: DialogType, title?: string, message?: string, content?: React.ReactNode, onConfirm?: (val?: string) => void}) => void;
    setClose: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
    open: false,
    title: "success",
    type: "success",
    message:"Action completed successfully.",
    content: undefined,
    onConfirm: undefined,
    setOpen: (value) => set({ 
        open: value.open, 
        type: value.type, 
        title: value.title || "",
        message: value.message || "",
        content: value.content,
        onConfirm: value.onConfirm
    }),
    setClose: () => set({ open: false, type: "success" , title:"", message:"", content: undefined, onConfirm: undefined }),
}))

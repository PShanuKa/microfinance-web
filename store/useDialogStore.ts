import { create } from 'zustand'
import React from 'react';

export type DialogType = "success" | "error" | "info" | "confirmation" | "approve" | "delete";

interface DialogState {
    open: boolean;
    type: DialogType;
    title : string;
    message : string;
    content?: React.ReactNode;
    showInput?: boolean;
    onConfirm?: (value?: string) => void;
    setOpen: (value: {open: boolean, type: DialogType, title?: string, message?: string, content?: React.ReactNode, showInput?: boolean, onConfirm?: (val?: string) => void}) => void;
    setClose: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
    open: false,
    title: "success",
    type: "success",
    message:"Action completed successfully.",
    content: undefined,
    showInput: false,
    onConfirm: undefined,
    setOpen: (value) => set({ 
        open: value.open, 
        type: value.type, 
        title: value.title || "",
        message: value.message || "",
        content: value.content,
        showInput: value.showInput || false,
        onConfirm: value.onConfirm
    }),
    setClose: () => set({ open: false, type: "success" , title:"", message:"", content: undefined, showInput: false, onConfirm: undefined }),
}))

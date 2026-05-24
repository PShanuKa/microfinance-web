import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useDialogStore } from "@/store/useDialogStore";
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";

export const CommonDialog = () => {
  const { open, type, setClose, message, onConfirm, title, content } = useDialogStore();
  const [inputValue, setInputValue] = useState("");

  const isError = type === "error";
  const isConfirmation = type === "confirmation";
  const isApprove = type === "approve";
  const isDelete = type === "delete";

  // Reset input when dialog closes
  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  const handleAction = () => {
    if (isConfirmation && onConfirm) {
      onConfirm(inputValue);
    } else if (onConfirm) {
      onConfirm();
    }
    setClose();
  };

  const getIcon = () => {
    if (isError) return <AlertCircle className="w-8 h-8" />;
    if (isConfirmation) return <AlertTriangle className="w-8 h-8" />;
    if (isApprove) return <CheckCircle2 className="w-8 h-8" />;
    if (isDelete) return <Trash2 className="w-8 h-8" />;
    return <ShieldCheck className="w-8 h-8" />;
  };

  const getIconContainerClass = () => {
    if (isError) return "bg-red-100 border-red-200 text-red-600";
    if (isConfirmation) return "bg-amber-100 border-amber-200 text-amber-600";
    if (isApprove) return "bg-emerald-100 border-emerald-200 text-emerald-600";
    if (isDelete) return "bg-red-100 border-red-200 text-red-600";
    return "bg-emerald-100 border-emerald-200 text-emerald-600";
  };

  const getTitle = () => {
    if (isError) return "Action Failed";
    if (isConfirmation) return "Confirmation";
    if (isApprove) return "Approve Request";
    if (isDelete) return "Delete Record";
    return "Action Complete";
  };

  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent className="bg-card border max-w-sm p-6 shadow-2xl text-center flex flex-col items-center gap-4">
        <div 
          className={`w-14 h-14 rounded-full border flex items-center justify-center animate-bounce ${getIconContainerClass()}`}
        >
           {getIcon()}
        </div>
        <div className="w-full">
          <DialogTitle className="text-lg font-black text-slate-800">
            {title || getTitle()}
          </DialogTitle>
          <DialogDescription className="text-sm font-semibold text-slate-600 mt-1">
            {message}
          </DialogDescription>
          
          {content && (
            <div className="mt-4 text-left w-full">
              {content}
            </div>
          )}
          
          {isConfirmation && !content && (
            <div className="mt-4 text-left">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Reason for Rejection</label>
              <Textarea 
                placeholder="Enter your reason here..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full min-h-[80px] text-sm resize-none"
              />
            </div>
          )}
        </div>
        <DialogFooter className={`w-full  ${(isConfirmation || isApprove || isDelete) ? "grid grid-cols-2 gap-2" : "flex-col"}   gap-2 sm:justify-between mt-2`}>
          {(isConfirmation || isApprove || isDelete) && (
            <Button
              variant="outline"
              onClick={setClose}
              className="w-full font-bold uppercase tracking-wider text-[10px] h-11 rounded-lg"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleAction}
            className={`w-full font-bold uppercase tracking-wider text-[10px] ${isConfirmation ? "bg-amber-600 hover:bg-amber-700" : (isError || isDelete) ? "bg-red-600 hover:bg-red-700" : isApprove ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800"}  text-white h-11 rounded-lg`}
          >
            {isError ? "Close" : isConfirmation ? "Confirm" : isDelete ? "Delete" : isApprove ? "Approve" : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

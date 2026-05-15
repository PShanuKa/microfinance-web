import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const attachmentService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/attachments/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/attachments/${id}`);
    return response.data;
  },
};

export const useUploadAttachmentMutation = (options = {}) => {
  return useMutation({
    mutationFn: attachmentService.upload,
    ...options,
  });
};

export const useDeleteAttachmentMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attachmentService.delete,
    ...options,
  });
};

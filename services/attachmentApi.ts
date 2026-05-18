import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const attachmentService = {
  upload: async (arg: File | { file: File; category?: string }) => {
    let file: File;
    let category: string | undefined;

    if (arg instanceof File) {
      file = arg;
    } else {
      file = arg.file;
      category = arg.category;
    }

    const formData = new FormData();
    formData.append("file", file);

    const url = category ? `/attachments/upload?category=${category}` : "/attachments/upload";
    const response = await api.post(url, formData, {
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

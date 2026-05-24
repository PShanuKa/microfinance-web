import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const nonCollectionWeekService = {
  getWeeks: async () => {
    const response = await api.get("/non-collection-weeks");
    return response.data;
  },
  createWeek: async (data: any) => {
    const response = await api.post("/non-collection-weeks", data);
    return response.data;
  },
  updateWeek: async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`/non-collection-weeks/${id}`, data);
    return response.data;
  },
  deleteWeek: async (id: string) => {
    const response = await api.delete(`/non-collection-weeks/${id}`);
    return response.data;
  },
};

export const useNonCollectionWeeksQuery = () => {
  return useQuery({
    queryKey: ["NonCollectionWeeks"],
    queryFn: () => nonCollectionWeekService.getWeeks(),
  });
};

export const useCreateNonCollectionWeekMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: nonCollectionWeekService.createWeek,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["NonCollectionWeeks"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useUpdateNonCollectionWeekMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: nonCollectionWeekService.updateWeek,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["NonCollectionWeeks"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useDeleteNonCollectionWeekMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: nonCollectionWeekService.deleteWeek,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["NonCollectionWeeks"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

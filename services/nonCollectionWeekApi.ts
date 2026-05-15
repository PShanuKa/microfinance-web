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

export const useCreateNonCollectionWeekMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nonCollectionWeekService.createWeek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["NonCollectionWeeks"] });
    },
    ...options,
  });
};

export const useUpdateNonCollectionWeekMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nonCollectionWeekService.updateWeek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["NonCollectionWeeks"] });
    },
    ...options,
  });
};

export const useDeleteNonCollectionWeekMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nonCollectionWeekService.deleteWeek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["NonCollectionWeeks"] });
    },
    ...options,
  });
};

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const collectionService = {
  getDailyRegistry: async (params: { date?: string } = {}) => {
    const response = await api.get("/collections/daily-registry", { params });
    return response.data;
  },
  getCollections: async (params: { groupId?: string } = {}) => {
    const response = await api.get("/collections", { params });
    return response.data;
  },
  createCollection: async (data: any) => {
    const response = await api.post("/collections", data);
    return response.data;
  },
};

export const useDailyRegistryQuery = (params: any = {}, options = {}) => {
  return useQuery({
    queryKey: ["DailyRegistry", params],
    queryFn: () => collectionService.getDailyRegistry(params),
    ...options,
  });
};

export const useCollectionsQuery = (params: any = {}, options = {}) => {
  return useQuery({
    queryKey: ["Collections", params],
    queryFn: () => collectionService.getCollections(params),
    ...options,
  });
};

export const useCreateCollectionMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collectionService.createCollection,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["DailyRegistry"] });
      queryClient.invalidateQueries({ queryKey: ["Collections"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

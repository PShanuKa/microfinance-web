import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const collectionService = {
  getCollections: async (params: { groupId?: string } = {}) => {
    const response = await api.get("/collections", { params });
    return response.data;
  },
  createCollection: async (data: any) => {
    const response = await api.post("/collections", data);
    return response.data;
  }
};

export const useCollectionsQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["Collections", params],
    queryFn: () => collectionService.getCollections(params),
  });
};

export const useCreateCollectionMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collectionService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Collections"] });
      queryClient.invalidateQueries({ queryKey: ["Group"] });
      queryClient.invalidateQueries({ queryKey: ["Loan"] });
    },
    ...options,
  });
};

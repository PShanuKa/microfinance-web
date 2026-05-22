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
  getCollectionById: async (id: string) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },
  approveCollection: async (payload: string | { id: string; confirmOverpayment?: boolean }) => {
    const id = typeof payload === "string" ? payload : payload.id;
    const body = typeof payload === "string" ? {} : { confirmOverpayment: payload.confirmOverpayment };
    const response = await api.post(`/collections/${id}/approve`, body);
    return response.data;
  },
  rejectCollection: async (payload: string | { id: string; rejectionReason?: string }) => {
    const id = typeof payload === "string" ? payload : payload.id;
    const body = typeof payload === "string" ? {} : { rejectionReason: payload.rejectionReason };
    const response = await api.post(`/collections/${id}/reject`, body);
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

export const useCollectionQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["Collection", id],
    queryFn: () => collectionService.getCollectionById(id),
    enabled: !!id,
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

export const useApproveCollectionMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: string | { id: string; confirmOverpayment?: boolean }) => 
      collectionService.approveCollection(payload),
    onSuccess: (data, variables, ...args) => {
      const id = typeof variables === "string" ? variables : variables.id;
      queryClient.invalidateQueries({ queryKey: ["Collection", id] });
      queryClient.invalidateQueries({ queryKey: ["Collections"] });
      queryClient.invalidateQueries({ queryKey: ["DailyRegistry"] });
      if (options.onSuccess) options.onSuccess(data, variables, ...args);
    },
    ...options,
  });
};

export const useRejectCollectionMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: string | { id: string; rejectionReason?: string }) => 
      collectionService.rejectCollection(payload),
    onSuccess: (data, variables, ...args) => {
      const id = typeof variables === "string" ? variables : variables.id;
      queryClient.invalidateQueries({ queryKey: ["Collection", id] });
      queryClient.invalidateQueries({ queryKey: ["Collections"] });
      queryClient.invalidateQueries({ queryKey: ["DailyRegistry"] });
      if (options.onSuccess) options.onSuccess(data, variables, ...args);
    },
    ...options,
  });
};

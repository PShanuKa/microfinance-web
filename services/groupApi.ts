import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const groupService = {
  getGroups: async (params: any = {}) => {
    const response = await api.get("/groups", { params });
    return response.data;
  },
  getGroup: async (id: string) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },
  createGroup: async (data: any) => {
    const response = await api.post("/groups", data);
    return response.data;
  },
  updateGroup: async ({ id, ...data }: any) => {
    const response = await api.put(`/groups/${id}`, data);
    return response.data;
  },
  addMember: async ({ groupId, clientId, isLeader }: any) => {
    const response = await api.post(`/groups/${groupId}/members`, { clientId, isLeader });
    return response.data;
  },
  updateMember: async ({ memberId, ...data }: any) => {
    const response = await api.put(`/groups/members/${memberId}`, data);
    return response.data;
  },
  removeMember: async (memberId: string) => {
    const response = await api.delete(`/groups/members/${memberId}`);
    return response.data;
  },
  deleteGroup: async (id: string) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },
  getCollectionSheet: async (groupId: string, week?: number) => {
    const params = week ? { week } : {};
    const response = await api.get(`/groups/${groupId}/collection-sheet`, { params });
    return response.data;
  },
};

export const useGroupsQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["Groups", params],
    queryFn: () => groupService.getGroups(params),
  });
};

export const useCollectionSheetQuery = (groupId: string, week?: number) => {
  return useQuery({
    queryKey: ["CollectionSheet", groupId, week],
    queryFn: () => groupService.getCollectionSheet(groupId, week),
    enabled: !!groupId,
  });
};

export const useGroupQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["Group", id],
    queryFn: () => groupService.getGroup(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateGroupMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.createGroup,
    ...options,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useUpdateGroupMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.updateGroup,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Group", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useAddMemberMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.addMember,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Group", variables.groupId] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateMemberMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.updateMember,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Group", data.member.groupId] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRemoveMemberMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string>({
    mutationFn: groupService.removeMember,
    ...options,
    onSuccess: (data: any, variables: string, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Group"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteGroupMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string>({
    mutationFn: groupService.deleteGroup,
    ...options,
    onSuccess: (data: any, variables: string, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const groupService = {
  getGroups: async (params: { page?: number; limit?: number; search?: string } = {}) => {
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
};

export const useGroupsQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["Groups", params],
    queryFn: () => groupService.getGroups(params),
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

export const useCreateGroupMutation = (options = {}) => {
  return useMutation({
    mutationFn: groupService.createGroup,
    ...options,
  });
};

export const useUpdateGroupMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.updateGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["Group", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
    },
    ...options,
  });
};

export const useAddMemberMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.addMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["Group", variables.groupId] });
    },
    ...options,
  });
};

export const useUpdateMemberMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.updateMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Group", data.member.groupId] });
    },
    ...options,
  });
};

export const useRemoveMemberMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Group"] });
    },
    ...options,
  });
};

export const useDeleteGroupMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
    },
    ...options,
  });
};

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const mortgageLoanService = {
  getMortgageLoans: async (params: { page?: number; limit?: number; search?: string; status?: string; branchId?: string } = {}) => {
    const response = await api.get("/mortgage-loans", { params });
    return response.data;
  },
  getMortgageLoan: async (id: string) => {
    const response = await api.get(`/mortgage-loans/${id}`);
    return response.data;
  },
  createMortgageLoan: async (data: any) => {
    const response = await api.post("/mortgage-loans", data);
    return response.data;
  },
  updateMortgageLoan: async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`/mortgage-loans/${id}`, data);
    return response.data;
  },
  approveMortgageLoan: async (id: string) => {
    const response = await api.put(`/mortgage-loans/${id}/approve`);
    return response.data;
  },
  rejectMortgageLoan: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
    const response = await api.put(`/mortgage-loans/${id}/reject`, { rejectionReason });
    return response.data;
  },
};

export const useMortgageLoansQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["MortgageLoans", params],
    queryFn: () => mortgageLoanService.getMortgageLoans(params),
  });
};

export const useMortgageLoanQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["MortgageLoan", id],
    queryFn: () => mortgageLoanService.getMortgageLoan(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateMortgageLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any, any>({
    mutationFn: mortgageLoanService.createMortgageLoan,
    ...options,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useUpdateMortgageLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; data: any }, any>({
    mutationFn: mortgageLoanService.updateMortgageLoan,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["MortgageLoan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useApproveMortgageLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string, any>({
    mutationFn: mortgageLoanService.approveMortgageLoan,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["MortgageLoan", variables] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRejectMortgageLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; rejectionReason: string }, any>({
    mutationFn: mortgageLoanService.rejectMortgageLoan,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["MortgageLoan", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};


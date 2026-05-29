import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const mortgageLoanService = {
  getMortgageLoans: async (params: { page?: number; limit?: number; search?: string; status?: string; branchId?: string } = {}) => {
    const response = await api.get("/mortgage-loans", { params });
    return response.data;
  },
  getMortgageCollections: async (params: { page?: number; limit?: number; search?: string; startDate?: string; endDate?: string } = {}) => {
    const response = await api.get("/mortgage-loans/collections", { params });
    return response.data;
  },
  exportMortgageCollectionsToPdf: async (params: { search?: string; startDate?: string; endDate?: string } = {}) => {
    const response = await api.get("/mortgage-loans/collections/export/pdf", { params, responseType: 'blob' });
    return response.data;
  },
  getMortgageCollection: async (id: string) => {
    const response = await api.get(`/mortgage-loans/collections/${id}`);
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
  sendMortgageLoanForApproval: async (id: string) => {
    const response = await api.put(`/mortgage-loans/${id}/send-for-approval`);
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
  exportMortgageLoanToPdf: async (id: string) => {
    const response = await api.get(`/mortgage-loans/${id}/export/pdf`, { responseType: 'blob' });
    return response.data;
  },
  recordMortgagePayment: async ({ id, amount, notes }: { id: string; amount: number; notes?: string }) => {
    const response = await api.post(`/mortgage-loans/${id}/payment`, { amount, notes });
    return response.data;
  },
  completeMortgageLoan: async (id: string) => {
    const response = await api.post(`/mortgage-loans/${id}/complete`);
    return response.data;
  },
};

export const useMortgageLoansQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["MortgageLoans", params],
    queryFn: () => mortgageLoanService.getMortgageLoans(params),
  });
};

export const useMortgageCollectionsQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["MortgageCollections", params],
    queryFn: () => mortgageLoanService.getMortgageCollections(params),
  });
};

export const useMortgageCollectionQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["MortgageCollection", id],
    queryFn: () => mortgageLoanService.getMortgageCollection(id),
    enabled: !!id,
    ...options,
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

export const useSendMortgageLoanForApprovalMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string, any>({
    mutationFn: mortgageLoanService.sendMortgageLoanForApproval,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["MortgageLoan", variables] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRecordMortgagePaymentMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; amount: number; notes?: string }, any>({
    mutationFn: mortgageLoanService.recordMortgagePayment,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["MortgageLoan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useCompleteMortgageLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, string, any>({
    mutationFn: mortgageLoanService.completeMortgageLoan,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["MortgageLoans"] });
      queryClient.invalidateQueries({ queryKey: ["MortgageLoan", variables] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};



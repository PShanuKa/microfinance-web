import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const loanService = {
  getLoans: async (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const response = await api.get("/loans", { params });
    return response.data;
  },
  getLoan: async (id: string) => {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },
  getLoanInstalments: async (id: string) => {
    const response = await api.get(`/loans/${id}/instalments`);
    return response.data;
  },
  createLoan: async (data: any) => {
    const response = await api.post("/loans", data);
    return response.data;
  },
  approveLoan: async ({ id, approvedById }: { id: string; approvedById: string }) => {
    const response = await api.put(`/loans/${id}/approve`, { approvedById });
    return response.data;
  },
  rejectLoan: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
    const response = await api.put(`/loans/${id}/reject`, { rejectionReason });
    return response.data;
  },
  updateLoanSchedule: async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`/loans/${id}/schedule`, data);
    return response.data;
  },
  updateGuarantors: async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`/loans/${id}/guarantors`, data);
    return response.data;
  },
  deleteGuarantor: async ({ id, clientId, index }: { id: string; clientId: string; index: number }) => {
    const response = await api.delete(`/loans/${id}/guarantors/${clientId}/${index}`);
    return response.data;
  },
};

export const useLoansQuery = (params: any = {}) => {
  return useQuery({
    queryKey: ["Loans", params],
    queryFn: () => loanService.getLoans(params),
  });
};

export const useLoanQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["Loan", id],
    queryFn: () => loanService.getLoan(id),
    enabled: !!id,
    ...options,
  });
};

export const useLoanInstalmentsQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["Loan", id, "Instalments"],
    queryFn: () => loanService.getLoanInstalments(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.createLoan,
    ...options,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useApproveLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.approveLoan,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRejectLoanMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.rejectLoan,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateLoanScheduleMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.updateLoanSchedule,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateGuarantorsMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.updateGuarantors,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteGuarantorMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.deleteGuarantor,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

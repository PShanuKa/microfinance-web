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

export const useCreateLoanMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
      queryClient.invalidateQueries({ queryKey: ["Groups"] }); // Invalidate groups as they might have a new active loan
    },
    ...options,
  });
};

export const useApproveLoanMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.approveLoan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
    },
    ...options,
  });
};

export const useRejectLoanMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.rejectLoan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
    },
    ...options,
  });
};

export const useUpdateLoanScheduleMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanService.updateLoanSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["Loan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Loans"] });
    },
    ...options,
  });
};

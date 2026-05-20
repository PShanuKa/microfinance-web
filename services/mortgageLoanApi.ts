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

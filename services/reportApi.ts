import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const reportService = {
  getClientWiseReport: async (params: { startDate?: string; endDate?: string; search?: string; page?: number; limit?: number; paymentStatus?: string }) => {
    const response = await api.get("/reports/client-wise", { params });
    return response.data;
  },
};

export const useClientWiseReportQuery = (params: any = {}, options = {}) => {
  return useQuery({
    queryKey: ["ClientWiseReport", params],
    queryFn: () => reportService.getClientWiseReport(params),
    ...options,
  });
};

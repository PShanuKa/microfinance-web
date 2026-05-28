import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const reportService = {
  getClientWiseReport: async (params: { startDate?: string; endDate?: string; search?: string; page?: number; limit?: number; paymentStatus?: string }) => {
    const response = await api.get("/reports/client-wise", { params });
    return response.data;
  },
  exportClientWiseReportToPdf: async (params: { startDate?: string; endDate?: string; search?: string; paymentStatus?: string } = {}) => {
    const response = await api.get("/reports/client-wise/export/pdf", { params, responseType: 'blob' });
    return response.data;
  }
};

export const useClientWiseReportQuery = (params: any = {}, options = {}) => {
  return useQuery({
    queryKey: ["ClientWiseReport", params],
    queryFn: () => reportService.getClientWiseReport(params),
    ...options,
  });
};

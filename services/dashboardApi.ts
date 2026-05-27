import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const dashboardService = {
  getStats: async (branchId?: string) => {
    const url = branchId ? `/dashboard/stats?branchId=${branchId}` : "/dashboard/stats";
    const response = await api.get(url);
    return response.data;
  },
  getMortgageDashboardStats: async (branchId?: string) => {
    const url = branchId
      ? `/mortgage-dashboard/stats?branchId=${branchId}`
      : "/mortgage-dashboard/stats";
    const response = await api.get(url);
    return response.data;
  },
};

export const useDashboardStatsQuery = (branchId?: string) => {
  return useQuery({
    queryKey: ["DashboardStats", branchId],
    queryFn: () => dashboardService.getStats(branchId),
  });
};

export const useMortgageDashboardStatsQuery = (branchId?: string) => {
  return useQuery({
    queryKey: ["MortgageDashboardStats", branchId],
    queryFn: () => dashboardService.getMortgageDashboardStats(branchId),
  });
};

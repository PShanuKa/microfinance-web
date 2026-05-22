import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const dashboardService = {
  getStats: async (branchId?: string) => {
    const url = branchId ? `/dashboard/stats?branchId=${branchId}` : "/dashboard/stats";
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

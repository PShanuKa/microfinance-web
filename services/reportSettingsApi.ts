import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const reportSettingsService = {
  getSettings: async () => {
    const response = await api.get("/report-settings");
    return response.data;
  },
  updateSettings: async (data: any) => {
    const response = await api.put("/report-settings", data);
    return response.data;
  },
};

export const useReportSettingsQuery = () => {
  return useQuery({
    queryKey: ["ReportSettings"],
    queryFn: () => reportSettingsService.getSettings(),
  });
};

export const useUpdateReportSettingsMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportSettingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportSettings"] });
    },
    ...options,
  });
};

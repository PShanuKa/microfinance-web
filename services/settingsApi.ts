import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const settingsService = {
  getSettings: async () => {
    const response = await api.get("/settings");
    return response.data;
  },
  updateSettings: async (data: any) => {
    const response = await api.put("/settings", data);
    return response.data;
  },
};

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: ["Settings"],
    queryFn: () => settingsService.getSettings(),
  });
};

export const useUpdateSettingsMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Settings"] });
    },
    ...options,
  });
};

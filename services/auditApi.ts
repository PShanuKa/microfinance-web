import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// API Functions
const auditService = {
  getAuditLogs: async (params: { 
    page?: number; 
    limit?: number; 
    entity?: string; 
    action?: string; 
    userId?: string; 
  }) => {
    const response = await api.get("/audit", { params });
    return response.data;
  },
  getAuditLogById: async (id: string) => {
    const response = await api.get(`/audit/${id}`);
    return response.data;
  },
};

// Custom Hooks
export const useAuditLogsQuery = (params: { 
  page?: number; 
  limit?: number; 
  entity?: string; 
  action?: string; 
  userId?: string; 
}, options = {}) => {
  return useQuery({
    queryKey: ["AuditLogs", params],
    queryFn: () => auditService.getAuditLogs(params),
    ...options,
  });
};

export const useAuditLogQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["AuditLog", id],
    queryFn: () => auditService.getAuditLogById(id),
    enabled: !!id,
    ...options,
  });
};

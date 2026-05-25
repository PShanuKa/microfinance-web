import React from "react";
import { useGetMeQuery } from "@/services/authApi";

interface RoleGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGate Wrapper Component
 * 
 * Usage:
 * <RoleGate allowedRoles={["ADMIN", "BRANCH_MANAGER"]}>
 *   <Button>Approve Loan</Button>
 * </RoleGate>
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { data: userData, isLoading } = useGetMeQuery();
  
  if (isLoading) {
    return null; // Don't render fallback immediately while loading
  }

  let userRoles = userData?.user?.roles || [];
  if (typeof userRoles === 'string') {
    try { userRoles = JSON.parse(userRoles); } catch (e) { userRoles = []; }
  }

  if (userRoles.length === 0 || !userRoles.some((role: string) => allowedRoles.includes(role))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * useHasRole Custom Hook
 * For programmatic role authorization inside React components
 * 
 * Usage:
 * const canEdit = useHasRole(["ADMIN", "LOAN_OFFICER"]);
 */
export const useHasRole = (allowedRoles: string[]): boolean => {
  const { data: userData, isLoading } = useGetMeQuery();
  
  if (isLoading) return false;

  let userRoles = userData?.user?.roles || [];
  if (typeof userRoles === 'string') {
    try { userRoles = JSON.parse(userRoles); } catch (e) { userRoles = []; }
  }

  if (userRoles.length === 0) return false;
  return userRoles.some((role: string) => allowedRoles.includes(role));
};

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
  const { data: userData } = useGetMeQuery();
  const userRole = userData?.user?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
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
  const { data: userData } = useGetMeQuery();
  const userRole = userData?.user?.role;

  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

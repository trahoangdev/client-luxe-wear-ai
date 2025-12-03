import { useAppSelector } from "@/store";

export function useTenant() {
  const tenantState = useAppSelector((s) => s.tenant);
  const currentTenant = tenantState.currentTenant;

  return {
    ...tenantState,
    currentTenant,
    hasTenant: !!currentTenant,
  };
}



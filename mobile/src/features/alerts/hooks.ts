import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';
import { testAlertPayload } from '@/features/alerts/testAlertPayload';

export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts,
    queryFn: async () => {
      const { data, error } = await api.GET('/alerts');
      if (error) throw error;
      return data;
    },
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: queryKeys.alert(id),
    queryFn: async () => {
      const { data, error } = await api.GET('/alerts/{id}', {
        params: { path: { id } },
      });

      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useAcknowledgeAlert(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await api.POST('/alerts/{id}/acknowledge', {
        params: { path: { id } },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alert(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
    },
  });
}

export function useResolveAlert(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await api.POST('/alerts/{id}/resolve', {
        params: { path: { id } },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alert(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
    },
  });
}

export function useEscalateAlert(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await api.POST('/alerts/{id}/escalate', {
        params: { path: { id } },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alert(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useTriggerTestAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await api.POST('/webhooks/alerts', {
        body: testAlertPayload,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

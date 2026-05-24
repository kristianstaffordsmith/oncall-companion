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

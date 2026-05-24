import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/client';
import { throwIfError } from '@/api/throwIfError';
import { queryKeys } from '@/api/queryKeys';

export function useIncidents() {
  return useQuery({
    queryKey: queryKeys.incidents,
    queryFn: async () => {
      const { data, error, response } = await api.GET('/incidents');
      throwIfError(error, response);
      return data;
    },
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: queryKeys.incident(id),
    queryFn: async () => {
      const { data, error, response } = await api.GET('/incidents/{id}', {
        params: { path: { id } },
      });

      throwIfError(error, response);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useAddIncidentUpdate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: string) => {
      const { data, error, response } = await api.POST('/incidents/{id}/updates', {
        params: { path: { id } },
        body: { body },
      });

      throwIfError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incident(id) });
    },
  });
}

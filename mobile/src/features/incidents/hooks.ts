import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export function useIncidents() {
  return useQuery({
    queryKey: queryKeys.incidents,
    queryFn: async () => {
      const { data, error } = await api.GET('/incidents');
      if (error) throw error;
      return data;
    },
  });
}

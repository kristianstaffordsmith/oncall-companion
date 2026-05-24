import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const { data, error } = await api.GET('/me');
      if (error) throw error;
      return data;
    },
  });
}

export function useCurrentSchedule() {
  return useQuery({
    queryKey: queryKeys.currentSchedule,
    queryFn: async () => {
      const { data, error } = await api.GET('/schedule/current');
      if (error) throw error;
      return data;
    },
  });
}

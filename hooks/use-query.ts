'use client';

import { useQuery as useReactQuery, UseQueryOptions as ReactUseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

type UseQueryOptions<TData = unknown, TError = Error> = Omit<
  ReactUseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
> & {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
};

export function useQuery<TData = unknown, TError = Error>(
  endpoint: string,
  options: UseQueryOptions<TData, TError> = {}
) {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5,
    gcTime = 1000 * 60 * 10,
    params,
    ...restOptions
  } = options;

  return useReactQuery<TData, TError>({
    queryKey: [endpoint, params],
    queryFn: () => apiClient<TData>(endpoint, { params }),
    enabled,
    staleTime,
    gcTime,
    ...restOptions,
  });
}


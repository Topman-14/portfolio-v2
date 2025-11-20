'use client';

import {
  useMutation as useReactMutation,
  UseMutationOptions as ReactUseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

type UseMutateOptions<TData = unknown, TVariables = unknown, TError = Error> =
  Omit<ReactUseMutationOptions<TData, TError, TVariables>, 'mutationFn'> & {
    invalidateQueries?: string[];
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  };

export function useMutate<
  TData = unknown,
  TVariables = unknown,
  TError = Error,
>(
  endpoint: string,
  options: UseMutateOptions<TData, TVariables, TError> = {}
) {
  const queryClient = useQueryClient();
  const {
    invalidateQueries = [],
    method = 'POST',
    onSuccess,
    ...restOptions
  } = options;

  return useReactMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      if (method === 'GET') {
        return apiClient<TData>(endpoint, {
          method,
          params: variables as Record<string, string | number | boolean | null | undefined>,
        });
      }
      return apiClient<TData>(endpoint, {
        method,
        body: variables as never,
      });
    },
    onSuccess: (data, variables, context) => {
      for (const queryKey of invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      onSuccess?.(data, variables, context as never);
    },
    ...restOptions,
  });
}


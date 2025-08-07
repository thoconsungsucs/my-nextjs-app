import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

import { User } from '@/types/api';

import { api } from './api-client';
import { createSession, deleteSession, Session } from './session';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

export const getUser = async (): Promise<User> => {
  const response = (await api.get('/auth/me')) as { data: User };

  return response.data;
};

const userQueryKey = ['user'];

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });
};

export const useUser = () => useQuery(getUserQueryOptions());

export const useLogin = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: async (data) => {
      queryClient.setQueryData(userQueryKey, data.user);
      await createSession(data);
      onSuccess?.();
    },
  });
};

export const useRegister = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: registerWithEmailAndPassword,
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userQueryKey });
      onSuccess?.();
    },
  });
};

const logout = (): Promise<void> => {
  deleteSession();
  return Promise.resolve();
};

export const loginInputSchema = z.object({
  userName: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<Session> => {
  return api.post('/api/auth/login', data);
};

export const registerInputSchema = z.object({
  userName: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
  fullName: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  email: z.string().min(1, 'Required').email('Invalid email'),
  address: z.string().min(1, 'Required'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = (data: RegisterInput): Promise<void> => {
  return api.post('/api/user/register', data);
};

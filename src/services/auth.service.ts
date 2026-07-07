// src/services/auth.service.ts
import api from '../lib/axios';
import type {
  CurrentUserPayload,
  RegisterPayload,
  RegisterResponse,
} from '../types/auth.types';

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(
    '/auth/register',
    payload,
  );
  return data;
}

export async function getMe(): Promise<CurrentUserPayload> {
  const { data } = await api.get<CurrentUserPayload>('/auth/me');
  return data;
}

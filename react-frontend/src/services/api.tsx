import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { BASE_URL } from './apiClient';

interface ApiResult {
  status: 'success';
  data: any;
}

interface ApiError {
  status: 'fail' | 'error';
  message: string;
}

type ApiResponse = ApiResult | ApiError;

export class ApiException extends Error {
  constructor(response: ApiError) {
    super(response.message);
  }
}

async function apiCall(url: string, method = 'get', data?: any) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `${BASE_URL}/${url}`;
  }

  let res: ApiResponse;
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const body = data ? JSON.stringify(data) : undefined;
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    res = await response.json();
  } catch (error) {
    // generic connection error
    const errSwal = withReactContent(Swal);

    await errSwal.fire({
      title: <p>Connection error</p>,
      icon: 'error',
    });
    console.error('[API SERVICE] error', { error });
    throw new ApiException({
      status: 'error',
      message: 'Connection error',
    });
  }

  if (res.status !== 'success') {
    // internal server error or call error
    const errSwal = withReactContent(Swal);

    await errSwal.fire({
      title: <p>{res.message}</p>,
      icon: 'error',
    });
    throw res;
  }

  return res.data;
}

export function apiPost<T = any>(url: string, data: object): Promise<T> {
  return apiCall(url, 'post', data);
}

export function apiGet<T = any>(url: string): Promise<T> {
  return apiCall(url, 'get');
}

export function apiDelete<T = any>(url: string): Promise<T> {
  return apiCall(url, 'delete');
}

export function apiPut<T = any>(url: string, data: object): Promise<T> {
  return apiCall(url, 'put', data);
}

import { getBase } from './shared';

export class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
    const apiBase = getBase();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add token to headers if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, data };
  }

  // Helper methods for common HTTP methods
  async get(endpoint: string, options: Omit<RequestInit, 'method'> = {}) {
    return this.fetch(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint: string, body: any, options: Omit<RequestInit, 'method' | 'body'> = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint: string, body: any, options: Omit<RequestInit, 'method' | 'body'> = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string, options: Omit<RequestInit, 'method'> = {}) {
    return this.fetch(endpoint, { ...options, method: 'DELETE' });
  }
}
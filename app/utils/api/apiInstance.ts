        // apiInstance.ts
        import { getBase } from './shared';

        export interface FetchResult {
        ok: boolean;
        data: any;
        }

        const apiBase = getBase();
        console.log('API Base URL:', apiBase);

        function getToken(): string | null {
        return localStorage.getItem('token');
        }

        async function request(
        method: string,
        url: string,
        body?: any
        ): Promise<FetchResult> {
        const token = getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            }
            console.log(headers)
            console.log('body:', body)

        const res = await fetch(`${apiBase}${url}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        console.log(res)
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, data };
        }

        // Define 4 basic HTTP functions
        export const http = {
        get: (url: string) => request('GET', url),
        post: (url: string, body?: any) => request('POST', url, body),
        put: (url: string, body?: any) => request('PUT', url, body),
        delete: (url: string) => request('DELETE', url),
        };

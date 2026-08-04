const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken && !options.skipAuth) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const url = `${API_URL}${path}`;
  let response = await fetch(url, { ...options, headers });

  // Handle Token Refresh on 401
  if (response.status === 401 && accessToken && !options.skipAuth) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        accessToken = data.accessToken;
        headers.set('Authorization', `Bearer ${accessToken}`);
        
        // Retry the original request
        response = await fetch(url, { ...options, headers });
      } else {
        // Clear token if refresh fails
        accessToken = null;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-logout'));
        }
      }
    } catch (err) {
      accessToken = null;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

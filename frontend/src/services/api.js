const API_URL = import.meta.env.VITE_API_URL;

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle token refresh (sliding session)
    const newToken = response.headers.get('x-new-token');
    if (newToken) {
      localStorage.setItem('token', newToken);
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      const text = await response.text();
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || 'Request failed');
      } catch (e) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
    }
    
    return response.json();
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);
    throw error;
  }
};

export const signup = async (name, email, password) => {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
};

export const login = async (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const forgotPassword = async (email) => {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword, confirmPassword })
  });
};

// Example for other authenticated requests
export const getProfile = async () => {
  return apiRequest('/auth/profile');
};
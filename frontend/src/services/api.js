const API_URL = import.meta.env.VITE_API_URL;

export const signup = async (name, email, password) => {
  const url = `${API_URL}/auth/signup`;
  console.log('[API] Requesting:', url);
  try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      console.log('[API] Response status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error('[API] Error response body:', text);
        try {
            const error = JSON.parse(text);
            throw new Error(error.message || 'Signup failed');
        } catch (e) {
            throw new Error(`Signup failed: ${response.status} ${response.statusText || 'Unknown Error'}`);
        }
      }
      
      return response.json();
  } catch (error) {
      console.error('[API] Signup error:', error);
      throw error;
  }
};

export const login = async (email, password) => {
  const url = `${API_URL}/auth/login`;
  console.log('[API] Requesting:', url);
  try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('[API] Response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('[API] Error response body:', text);
        try {
            const error = JSON.parse(text);
            throw new Error(error.message || 'Login failed');
        } catch (e) {
            throw new Error(`Login failed: ${response.status} ${response.statusText || 'Unknown Error'}`);
        }
      }
      
      return response.json();
  } catch (error) {
      console.error('[API] Login error:', error);
      throw error;
  }
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
};

export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetToken, newPassword, confirmPassword })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Reset failed');
  }
  
  return response.json();
};
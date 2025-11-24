const API_BASE_URL = 'http://localhost:5000/api/v1';

export const authApi = {
  // --------------------------------------------------
  // 1. Verify invitation
  // --------------------------------------------------
  async verifyInvitation(token, email) {
    const res = await fetch(
      `${API_BASE_URL}/invite/verify?token=${token}&email=${email}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invitation verification failed');
    return data;
  },

  // --------------------------------------------------
  // 2. Temporary login (first-time login)
  // --------------------------------------------------
  async temporaryLogin(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login/temporary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Temporary login failed');
    return data;
  },

  // --------------------------------------------------
  // 3. Set new password (first-time password)
  // --------------------------------------------------
  async setNewPassword(userId, newPassword) {
    const res = await fetch(`${API_BASE_URL}/auth/password/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Set password failed');
    return data;
  },

  // --------------------------------------------------
  // 4. Normal login
  // --------------------------------------------------
  async login(email, password, rememberMe = false) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // --------------------------------------------------
  // 5. Verify OTP after login
  // --------------------------------------------------
  async verifyLoginOtp(email, otp) {
    const res = await fetch(`${API_BASE_URL}/auth/login/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'OTP verification failed');
    return data;
  },

  // --------------------------------------------------
  // 6. Send reset-password OTP
  // --------------------------------------------------
  async sendResetPasswordOtp(email) {
    const res = await fetch(`${API_BASE_URL}/auth/password/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send reset OTP');
    return data;
  },

  // --------------------------------------------------
  // 7. Verify reset-password OTP and update password
  // --------------------------------------------------
  async verifyResetPasswordOtp(email, otp, password) {
    const res = await fetch(`${API_BASE_URL}/auth/password/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset failed');
    return data;
  },
};

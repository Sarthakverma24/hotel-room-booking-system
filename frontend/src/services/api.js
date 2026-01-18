const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }
};

export const roomService = {
  getRooms: async () => {
    const response = await fetch(`${API_BASE}/rooms`);
    return response.json();
  },

  bookRooms: async (guestName, numRooms) => {
    const response = await fetch(`${API_BASE}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName, numRooms })
    });
    const data = await response.json();
    return { data, ok: response.ok };
  },

  generateRandomOccupancy: async () => {
    const response = await fetch(`${API_BASE}/generate-occupancy`, {
      method: 'POST'
    });
    return response.json();
  },

  resetAllBookings: async () => {
    const response = await fetch(`${API_BASE}/reset-bookings`, {
      method: 'POST'
    });
    return response.json();
  }
};

export const bookingService = {
  getBookings: async () => {
    const response = await fetch(`${API_BASE}/bookings`);
    return response.json();
  }
};
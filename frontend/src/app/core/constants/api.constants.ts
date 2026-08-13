export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const SOCKET_URL = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ''
);
const SERVER_HOST =
  window.location.hostname;

export const SERVER_BASE_URL =
  `http://${SERVER_HOST}:3000`;

export const API_BASE_URL =
  `${SERVER_BASE_URL}/api/v1`;

export const SOCKET_URL =
  SERVER_BASE_URL;
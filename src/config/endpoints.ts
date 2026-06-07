export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/v1/auth/register',
    LOGIN: '/v1/auth/login',
    GOOGLE_LOGIN: '/v1/auth/google-login',
    REFRESH: '/v1/auth/refresh',
    LOGOUT: '/v1/auth/logout',
    UPDATE_PROFILE: '/v1/auth/update-profile',
    CHANGE_PASSWORD: '/v1/auth/change-password',
    PING: '/v1/auth/ping',
  },
  PATIENTS: {
    BASE: '/v1/patients',
    STATUS: '/v1/patients/status',
    STATUS_DETAIL: (id: string | number) => `/v1/patients/status/${id}`,
    DETAIL: (id: string | number) => `/v1/patients/${id}`,
  },
  ANALYTICS: {
    DISTANCE: '/v1/analytics/distance',
    FORCE: '/v1/analytics/force',
  },
  DEVICES: {
    PING: '/v1/devices/ping',
  },
  METRICS: {
    BASE: '/v1/metrics',
  },
  USERS: {
    BASE: '/v1/users',
    DETAIL: (id: string | number) => `/v1/users/${id}`,
    ROLE: (id: string | number) => `/v1/users/${id}/role`,
  },
  ROLES: {
    BASE: '/v1/roles',
    DETAIL: (id: string | number) => `/v1/roles/${id}`,
  },
  PERMISSIONS: {
    BASE: '/v1/permissions',
  }
} as const;
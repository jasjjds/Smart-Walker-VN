import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export const patientService = {
  getPatients: (params?: any) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.BASE, { params });
  },

  createPatient: (data: any) => {
    return axiosClient.post(ENDPOINTS.PATIENTS.BASE, data);
  },

  getStatuses: (limit: number = 100) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.STATUS, {
      params: { limit }
    });
  },

  getStatusDetail: (id: string | number) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.STATUS_DETAIL(id));
  },

  getPatientDetail: (id: string | number) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.DETAIL(id));
  },

  updatePatient: (id: string | number, data: any) => {
    return axiosClient.patch(ENDPOINTS.PATIENTS.DETAIL(id), data);
  },

  deletePatient: (id: string | number) => {
    return axiosClient.delete(ENDPOINTS.PATIENTS.DETAIL(id));
  },

  getBooklet: () => {
    return axiosClient.get(ENDPOINTS.PATIENTS.BOOKLET);
  },

  getBookletById: (patientId: string | number) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.BOOKLET_DETAIL(patientId));
  },

  getBookletPage: (pageId: string | number) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.BOOKLET_PAGE(pageId));
  },

  updateBookletNotes: (pageId: string | number, notes: string) => {
    return axiosClient.patch(ENDPOINTS.PATIENTS.BOOKLET_PAGE_ASSESSMENT(pageId), { doctor_notes: notes });
  },

  searchPatients: (query: string) => {
    return axiosClient.get(ENDPOINTS.PATIENTS.SEARCH, { params: { query } });
  }
};

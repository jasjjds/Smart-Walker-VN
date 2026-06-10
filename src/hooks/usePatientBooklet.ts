// src/hooks/usePatientBooklet.ts

import { useState, useEffect } from 'react';
import { patientService } from '@/services/patientService';

export function usePatientBooklet(patientId?: string) {
  const [booklet, setBooklet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  // Fetch Patient Booklet
  useEffect(() => {
    const fetchBooklet = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = patientId
          ? await patientService.getBookletById(patientId) as any
          : await patientService.getBooklet() as any;
        if (response.success && response.data) {
          setBooklet(response.data);
        } else {
          setError(response.message || "Không thể lấy sổ khám bệnh.");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải sổ sức khỏe:", err);
        setError(err.response?.data?.message || "Lỗi kết nối máy chủ khi lấy sổ khám bệnh.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooklet();
  }, [patientId]);

  // Open booklet page details
  const handleOpenPageDetail = async (pageId: number) => {
    setSelectedPageId(pageId);
    setLoadingPage(true);
    try {
      const response = await patientService.getBookletPage(pageId) as any;
      if (response.success && response.data) {
        setSelectedPage(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết phiên tập:", err);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleClosePageDetail = () => {
    setSelectedPageId(null);
    setSelectedPage(null);
  };

  return {
    booklet,
    setBooklet,
    loading,
    error,
    setError,
    selectedPageId,
    setSelectedPageId,
    selectedPage,
    setSelectedPage,
    loadingPage,
    handleOpenPageDetail,
    handleClosePageDetail,
  };
}

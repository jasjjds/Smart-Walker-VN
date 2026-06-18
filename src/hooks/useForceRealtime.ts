// src/hooks/useForceRealtime.ts

import { useState, useEffect, useRef } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { CHART_CONFIG, POLLING_INTERVALS } from '@/config/constants';

interface ForceHistoryItem {
  left: number;
  right: number;
}

export function useForceRealtime(patientID: string | number) {
  const [isLive, setIsLive] = useState(false);
  const [currentForce, setCurrentForce] = useState({ left: 0, right: 0 });
  const [history, setHistory] = useState<ForceHistoryItem[]>(
    Array(CHART_CONFIG.HISTORY_LIMIT).fill({ left: 0, right: 0 })
  );
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Monitor visibility state to pause polling when tab is hidden (saves server requests & client CPU/battery)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!patientID) return;

    if (isLive && isTabVisible) {
      const fetchForceData = async () => {
        try {
          const res = await analyticsService.getForce({
            patient_id: patientID,
            limit: CHART_CONFIG.HISTORY_LIMIT
          }) as any;
          
          if (res.success && res.chartData && res.chartData.length > 0) {
            const fetchedHistory = res.chartData;
            const latest = fetchedHistory[fetchedHistory.length - 1];

            setCurrentForce({ left: latest.left || 0, right: latest.right || 0 });
            
            const mappedHistory = fetchedHistory.map((d: any) => ({
              left: d.left || 0,
              right: d.right || 0
            }));

            if (mappedHistory.length < CHART_CONFIG.HISTORY_LIMIT) {
              const padding = Array(CHART_CONFIG.HISTORY_LIMIT - mappedHistory.length).fill({ left: 0, right: 0 });
              setHistory([...padding, ...mappedHistory]);
            } else {
              setHistory(mappedHistory);
            }
          }
        } catch (error) {
          console.error("❌ Lỗi lấy dữ liệu Force Real-time:", error);
        }
      };

      fetchForceData();
      timerRef.current = setInterval(fetchForceData, POLLING_INTERVALS.REALTIME_MS);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLive, isTabVisible, patientID]);

  return {
    isLive,
    setIsLive,
    currentForce,
    history,
  };
}

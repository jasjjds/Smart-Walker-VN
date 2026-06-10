// src/hooks/useGaitRealtime.ts

import { useState, useEffect, useRef } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { CHART_CONFIG, POLLING_INTERVALS } from '@/config/constants';

export function useGaitRealtime(patientID: string | number, isPatientView: boolean) {
  const [isLive, setIsLive] = useState(false);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [velocityHistory, setVelocityHistory] = useState<{ velocity: number }[]>(
    Array(CHART_CONFIG.HISTORY_LIMIT).fill({ velocity: 0 })
  );
  const [sessionDistance, setSessionDistance] = useState(0);
  const [processedTimes, setProcessedTimes] = useState<Set<string>>(new Set());
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

  // Reset distance when starting live data
  useEffect(() => {
    if (isLive) {
      setSessionDistance(0);
      setProcessedTimes(new Set());
    }
  }, [isLive]);

  useEffect(() => {
    if (!patientID || !isPatientView) return;

    if (isLive && isTabVisible) {
      const fetchVelocityData = async () => {
        try {
          const res = await analyticsService.getVelocity({
            patient_id: patientID,
            limit: CHART_CONFIG.HISTORY_LIMIT
          }) as any;
          if (res.success && res.chartData && res.chartData.length > 0) {
            const fetchedHistory = res.chartData;
            const latest = fetchedHistory[fetchedHistory.length - 1];

            setCurrentVelocity(latest.velocity || 0);

            // Accumulate distance check against processed timestamps
            setProcessedTimes((prevTimes) => {
              const nextProcessed = new Set(prevTimes);
              let newDistance = 0;

              fetchedHistory.forEach((d: any) => {
                const timeKey = d.time;
                if (timeKey && !nextProcessed.has(timeKey)) {
                  nextProcessed.add(timeKey);
                  newDistance += d.distance || 0;
                }
              });

              if (newDistance > 0) {
                setSessionDistance((prevDist) => prevDist + newDistance);
              }
              return nextProcessed;
            });

            const mappedHistory = fetchedHistory.map((d: any) => ({
              velocity: d.velocity || 0
            }));

            if (mappedHistory.length < CHART_CONFIG.HISTORY_LIMIT) {
              const padding = Array(CHART_CONFIG.HISTORY_LIMIT - mappedHistory.length).fill({ velocity: 0 });
              setVelocityHistory([...padding, ...mappedHistory]);
            } else {
              setVelocityHistory(mappedHistory);
            }
          }
        } catch (error) {
          console.error("❌ Lỗi lấy dữ liệu Velocity Real-time:", error);
        }
      };

      fetchVelocityData();
      timerRef.current = setInterval(fetchVelocityData, POLLING_INTERVALS.REALTIME_MS);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLive, isTabVisible, patientID, isPatientView]);

  return {
    isLive,
    setIsLive,
    currentVelocity,
    velocityHistory,
    sessionDistance,
  };
}

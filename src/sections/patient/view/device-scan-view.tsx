"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { deviceService } from "@/services/deviceService";
import { BackButton } from "@/components/custom/back-button";

interface DeviceScanViewProps {
  deviceId: string;
}

type SessionState = "CONNECTING" | "ERROR" | "ACTIVE" | "FINISHING" | "SUMMARY";

export function DeviceScanView({ deviceId }: DeviceScanViewProps) {
  const router = useRouter();
  const [state, setState] = useState<SessionState>("CONNECTING");
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Session details
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [summaryData, setSummaryData] = useState<{
    avgForceLeft: number;
    avgForceRight: number;
    totalDistance: number;
    durationSeconds: number;
    title: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Kích hoạt thiết bị khi quét QR thành công
  useEffect(() => {
    let isCancelled = false;

    const startSession = async () => {
      try {
        setState("CONNECTING");
        setErrorMsg("");
        
        const response = await deviceService.scanQr(deviceId) as any;
        
        if (isCancelled) return;

        if (response.success) {
          setState("ACTIVE");
          if (typeof window !== "undefined") {
            localStorage.setItem("activeDeviceId", deviceId);
          }
          setStartTime(new Date());
          setElapsedSeconds(0);
          
          // Khởi động bộ đếm thời gian
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
          }, 1000);
        } else {
          setState("ERROR");
          setErrorMsg(response.message || "Thiết bị đang bận hoặc không thể kích hoạt.");
        }
      } catch (err: any) {
        if (isCancelled) return;
        console.error("Lỗi kích hoạt QR:", err);
        setState("ERROR");
        setErrorMsg(
          err.response?.data?.message || 
          "Kết nối đến máy chủ thất bại hoặc thiết bị đang được sử dụng."
        );
      }
    };

    startSession();

    return () => {
      isCancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [deviceId]);

  // 2. Kết thúc tập luyện
  const handleEndSession = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      setState("FINISHING");
      const response = await deviceService.endSession(deviceId) as any;
      
      if (response.success) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("activeDeviceId");
        }
        const page = response.data || response.page || {};
        setSummaryData({
          avgForceLeft: page.avg_force_left || 0,
          avgForceRight: page.avg_force_right || 0,
          totalDistance: page.total_distance || 0,
          durationSeconds: page.duration_seconds || elapsedSeconds,
          title: page.title || "Phiên tập luyện phục hồi",
        });
        setState("SUMMARY");
      } else {
        setState("ERROR");
        setErrorMsg("Có lỗi xảy ra khi đóng phiên tập luyện.");
      }
    } catch (err: any) {
      console.error("Lỗi kết thúc phiên tập:", err);
      setState("ERROR");
      setErrorMsg(err.response?.data?.message || "Không thể kết thúc phiên tập.");
    }
  };

  // Định dạng thời gian đếm giờ
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f9ff] text-[#0c4a6e] flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER */}
      <header className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9] rounded-xl flex items-center justify-center text-white font-black shadow-md">
            SW
          </div>
          <span className="font-extrabold text-lg tracking-wide uppercase">Smart Walker</span>
        </div>
        <div className="text-xs bg-white border border-[#bae6fd] px-3.5 py-1.5 rounded-full font-bold shadow-xs">
          Thiết bị: <span className="font-mono text-[#0ea5e9] font-black">{deviceId}</span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 z-10 min-h-0">
        
        {/* STATE: CONNECTING (RADAR SCANNER) */}
        {state === "CONNECTING" && (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <div className="relative w-44 h-44 flex items-center justify-center mb-8">
              {/* Radar Rings */}
              <div className="absolute inset-0 bg-[#0ea5e9]/10 rounded-full animate-ping pointer-events-none"></div>
              <div className="absolute w-32 h-32 bg-[#0ea5e9]/20 rounded-full animate-pulse pointer-events-none"></div>
              <div className="absolute w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#0ea5e9] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 4v1m-8-5h2m12-9l-2 2M6 18l2-2m10 2l-2-2M6 6l2 2" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-3">Đang kết nối thiết bị...</h2>
            <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
              Hệ thống đang gửi tín hiệu nhận xe và khởi động cảm biến tập đi của bạn.
            </p>
          </div>
        )}

        {/* STATE: ERROR SCREEN */}
        {state === "ERROR" && (
          <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl border border-red-100 flex flex-col items-center animate-fade-in text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">Kết nối thất bại</h2>
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl font-semibold mb-6">
              ⚠️ {errorMsg}
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white font-bold rounded-xl shadow-md transition-all"
              >
                Thử kết nối lại
              </button>
              <BackButton
                onClick={() => router.push("/dashboard/patient")}
                className="justify-center w-full py-3"
              />
            </div>
          </div>
        )}

        {/* STATE: ACTIVE SESSION */}
        {state === "ACTIVE" && (
          <div className="flex flex-col items-center justify-center w-full max-w-md animate-fade-in">
            {/* Pulsing Status Dot */}
            <div className="flex items-center gap-2 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-2 rounded-full text-xs font-black shadow-xs">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              ĐANG GHI NHẬN SỐ LIỆU TẬP LUYỆN
            </div>

            {/* Visual Ticking Timer */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-[#0ea5e9]/5 rounded-full border-4 border-dashed border-[#0ea5e9]/20 animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-4 bg-white shadow-xl rounded-full flex flex-col items-center justify-center border border-[#bae6fd]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Thời gian tập</span>
                <span className="text-4xl sm:text-5xl font-black text-[#0c4a6e] font-mono tracking-tight transition-all">
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="text-[10px] font-bold text-[#0ea5e9] mt-2 tracking-widest uppercase">Live Syncing</span>
              </div>
            </div>

            {/* Instruction Card */}
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#bae6fd] shadow-sm text-center mb-10 w-full">
              <h4 className="font-extrabold text-sm mb-1.5">Hướng dẫn buổi tập</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Vui lòng nắm chặt tay vịn, đứng thẳng người và bắt đầu di chuyển. Cảm biến trên xe sẽ ghi nhận và chia sẻ trực tiếp dữ liệu thăng bằng, lực tỳ tay lên hệ thống.
              </p>
            </div>

            {/* Big End workout Button */}
            <button
              onClick={handleEndSession}
              className="w-full py-4.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black rounded-2xl shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-base tracking-wider"
            >
              KẾT THÚC TẬP LUYỆN
            </button>
          </div>
        )}

        {/* STATE: FINISHING (POST-API LOADING) */}
        {state === "FINISHING" && (
          <div className="flex flex-col items-center justify-center animate-pulse">
            <svg className="w-14 h-14 animate-spin text-red-500 mb-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Đang hoàn thành phiên tập...</h2>
            <p className="text-xs text-gray-500 max-w-xs text-center leading-relaxed">
              Đang giải phóng xe, thu hồi chỉ số cảm biến và tính toán độ phân bổ cân bằng cho sổ y tế của bạn.
            </p>
          </div>
        )}

        {/* STATE: SUMMARY SCREEN */}
        {state === "SUMMARY" && summaryData && (
          <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl border border-[#bae6fd] flex flex-col items-center animate-fade-in">
            {/* Success icon */}
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-center mb-1">Tập luyện hoàn thành!</h2>
            <p className="text-xs text-gray-400 font-bold mb-6 uppercase tracking-wider">{summaryData.title}</p>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-2xl p-4 flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quãng đường</span>
                <span className="text-xl sm:text-2xl font-black text-[#0c4a6e]">{summaryData.totalDistance.toFixed(1)} <span className="text-xs text-slate-400">m</span></span>
              </div>
              <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-2xl p-4 flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Thời gian</span>
                <span className="text-xl sm:text-2xl font-black text-[#0c4a6e]">{formatTime(summaryData.durationSeconds)}</span>
              </div>
            </div>

            {/* Balance gauge */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 w-full mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lực tỳ trung bình</span>
                <span className="text-xs font-black text-[#0c4a6e]">
                  {(summaryData.avgForceLeft + summaryData.avgForceRight).toFixed(1)} kg
                </span>
              </div>

              {/* Force values display */}
              <div className="flex justify-between text-xs font-bold mb-3">
                <span className="text-[#0ea5e9]">{summaryData.avgForceLeft.toFixed(1)} kg (Trái)</span>
                <span className="text-[#0c4a6e]">{summaryData.avgForceRight.toFixed(1)} kg (Phải)</span>
              </div>

              {/* Balance bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full flex overflow-hidden shadow-inner">
                {summaryData.avgForceLeft + summaryData.avgForceRight > 0 ? (
                  <>
                    <div 
                      className="bg-[#0ea5e9] transition-all duration-500" 
                      style={{ width: `${(summaryData.avgForceLeft / (summaryData.avgForceLeft + summaryData.avgForceRight)) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-[#0c4a6e] transition-all duration-500" 
                      style={{ width: `${(summaryData.avgForceRight / (summaryData.avgForceLeft + summaryData.avgForceRight)) * 100}%` }}
                    ></div>
                  </>
                ) : (
                  <div className="w-full bg-slate-300"></div>
                )}
              </div>

              <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-wider mt-3">
                {summaryData.avgForceLeft + summaryData.avgForceRight > 0 ? (
                  Math.abs(summaryData.avgForceLeft - summaryData.avgForceRight) < 1.5 ? "Cân bằng tốt" : "Có độ lệch lực tỳ"
                ) : "Không ghi nhận lực tỳ"}
              </p>
            </div>

            {/* Note info */}
            <div className="text-center text-xs text-gray-500 leading-relaxed font-medium mb-6">
              📊 Phiên tập của bạn đã được xuất thành công sang trang sổ y tế điện tử. Bác sĩ của bạn sẽ phân tích kỹ hơn về chẩn đoán phục hồi dáng đi.
            </div>

            <BackButton
              onClick={() => router.push("/dashboard/patient")}
              className="justify-center w-full py-3.5"
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[10px] text-gray-400 z-10 font-bold tracking-wider uppercase mt-4 shrink-0">
        © 2026 Smart Walker VN • Healthcare Tech
      </footer>

      {/* Animation helpers inside style */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

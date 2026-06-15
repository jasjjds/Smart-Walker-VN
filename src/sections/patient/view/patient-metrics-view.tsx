"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePatientBooklet } from "@/hooks/usePatientBooklet";
import { patientService } from "@/services/patientService";
import { BRAND_CONFIG } from "@/config/brand";

export function PatientMetricsView() {
  const { user } = useAuth();
  const { booklet, loading: loadingBooklet } = usePatientBooklet();
  const [latestPageDetail, setLatestPageDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const loadLatestPageDetail = async () => {
      const pages = booklet?.pages || [];
      if (pages.length > 0) {
        // Sắp xếp để tìm phiên tập gần nhất
        const sortedPages = [...pages].sort(
          (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
        const latestPage = sortedPages[0];

        setLoadingDetail(true);
        try {
          const res = await patientService.getBookletPage(latestPage.id) as any;
          if (res.success && res.data) {
            setLatestPageDetail(res.data);
          }
        } catch (err) {
          console.error("Lỗi khi tải chi tiết phiên tập gần nhất:", err);
        } finally {
          setLoadingDetail(false);
        }
      }
    };

    if (booklet) {
      loadLatestPageDetail();
    }
  }, [booklet]);

  const loading = loadingBooklet || loadingDetail;

  // Tính toán dữ liệu chỉ số từ phiên tập gần nhất
  const avgForceLeft = latestPageDetail?.avg_force_left ?? 0;
  const avgForceRight = latestPageDetail?.avg_force_right ?? 0;
  const totalDistance = latestPageDetail?.total_distance ?? 0;
  const avgVelocity = latestPageDetail?.avg_velocity ?? 0;

  const sensorData = latestPageDetail?.sensor_data || [];
  const velocities = sensorData.map((d: any) => d.velocity || 0).filter((v: number) => v > 0);
  const minVelocity = velocities.length > 0 ? Math.min(...velocities) : 0;
  const maxVelocity = velocities.length > 0 ? Math.max(...velocities) : 0;

  // Phân tích và đưa ra đánh giá nhanh
  const diffForce = Math.abs(avgForceLeft - avgForceRight);
  const hasData = !!latestPageDetail;

  let assessmentText = "Chưa có dữ liệu luyện tập lực tì.";
  if (hasData) {
    if (avgForceLeft === 0 && avgForceRight === 0) {
      assessmentText = "Không phát hiện lực tì tay đáng kể trên tay cầm xe.";
    } else {
      const balanceComparison = avgForceLeft === avgForceRight
        ? "Lực tì hai bên cân bằng tuyệt đối. "
        : `Phát hiện lực tì bên ${avgForceLeft > avgForceRight ? 'trái' : 'phải'} cao hơn bên còn lại ${diffForce.toFixed(1)} kg. `;

      if (diffForce < 1.5) {
        assessmentText = balanceComparison + "Sự đối xứng lực tì tốt. Dáng đi của bạn rất cân bằng so với hệ quy chiếu người bình thường, hỗ trợ tối ưu cho tiến trình phục hồi chức năng.";
      } else if (diffForce < 3.0) {
        assessmentText = balanceComparison + "Lực tì có độ lệch nhẹ. Bạn nên lưu ý chia đều trọng lượng cơ thể lên cả hai tay cầm để ổn định tư thế đi thẳng.";
      } else {
        assessmentText = balanceComparison + "Cảnh báo chênh lệch lực tì cao. Tư thế đi có xu hướng nghiêng lệch hẳn sang một bên, cần tập trung dồn lực tay yếu hơn hoặc tham khảo ý kiến bác sĩ.";
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900">
      <div>
        <p className="text-primary-900/70 mt-1 text-xs sm:text-sm font-medium">
          {BRAND_CONFIG.patient.metricsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* THẺ 1: ĐO LỰC TÌ TAY */}
        <Link
          href="/dashboard/patient/metrics/force"
          className="group bg-white p-6 sm:p-8 rounded-3xl border border-primary-200 shadow-sm hover:shadow-xl hover:border-primary-500 transition-all duration-300 flex flex-col gap-5 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 rounded-2xl text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Đo lực tì tay</h3>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-12 bg-slate-100 rounded"></div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col gap-4 text-xs sm:text-sm font-medium">
              <div className="space-y-1">
                <p className="text-slate-600 flex justify-between">
                  <span>Lực tì tay trái trung bình:</span>
                  <span className="font-bold font-mono text-primary-500">{avgForceLeft.toFixed(1)} kg</span>
                </p>
                <p className="text-slate-600 flex justify-between">
                  <span>Lực tì tay phải trung bình:</span>
                  <span className="font-bold font-mono text-primary-900">{avgForceRight.toFixed(1)} kg</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Đánh giá nhanh</span>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  {assessmentText}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-bold italic text-right">
                * Cập nhật từ phiên tập gần nhất
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center text-primary-500 font-bold text-xs">
            Xem biểu đồ chi tiết
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* THẺ 2: QUÃNG ĐƯỜNG DI CHUYỂN */}
        <Link
          href="/dashboard/patient/metrics/gait"
          className="group bg-white p-6 sm:p-8 rounded-3xl border border-primary-200 shadow-sm hover:shadow-xl hover:border-primary-500 transition-all duration-300 flex flex-col gap-5 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 rounded-2xl text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Quãng đường di chuyển</h3>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-12 bg-slate-100 rounded"></div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col gap-3 text-xs sm:text-sm font-medium text-slate-600">
              <p className="flex justify-between">
                <span>Quãng đường đi được:</span>
                <span className="font-bold font-mono text-emerald-600">{totalDistance.toFixed(1)} m</span>
              </p>
              <p className="flex justify-between">
                <span>Vận tốc trung bình:</span>
                <span className="font-bold font-mono text-amber-600">{avgVelocity.toFixed(1)} m/s</span>
              </p>
              <p className="flex justify-between">
                <span>Vận tốc nhỏ nhất / tối đa:</span>
                <span className="font-bold font-mono text-primary-900">{minVelocity.toFixed(1)} / {maxVelocity.toFixed(1)} m/s</span>
              </p>

              <div className="pt-2 text-[10px] text-slate-400 font-bold italic text-right">
                * Cập nhật từ phiên tập gần nhất
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center text-primary-500 font-bold text-xs">
            Xem biểu đồ chi tiết
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}

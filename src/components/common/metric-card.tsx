// src/components/common/metric-card.tsx

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  description?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  variant?: 'overview' | 'minimal' | 'horizontal';
  valueColorClass?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  description,
  icon,
  iconBgColor = "bg-[#e0f2fe] text-[#0ea5e9]",
  variant = "overview",
  valueColorClass = "text-[#0c4a6e]",
  className = ""
}: MetricCardProps) {
  if (variant === 'minimal') {
    return (
      <div className={`bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl flex flex-col items-center text-center shadow-xs ${className}`}>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">{title}</span>
        <span className={`text-base sm:text-lg font-black ${valueColorClass}`}>
          {value} <span className="text-[10px] text-slate-400 font-bold">{unit}</span>
        </span>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between ${className}`}>
        <div>
          <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</h3>
          {description && <p className="text-[10px] sm:text-xs font-medium text-gray-600">{description}</p>}
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className={`text-xl sm:text-2xl font-black ${valueColorClass}`}>{value}</span>
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow ${className}`}>
      {icon && (
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">{title}</h3>
        <div className="flex items-end gap-1 mt-1">
          <span className={`text-2xl sm:text-3xl font-black ${valueColorClass}`}>{value}</span>
          <span className="text-xs sm:text-sm font-bold text-gray-400 pb-0.5">{unit}</span>
        </div>
      </div>
    </div>
  );
}

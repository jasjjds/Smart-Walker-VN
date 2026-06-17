"use client";

import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export interface CustomDatePickerProps {
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Chọn ngày...",
  disabled = false,
  ...props
}) => {
  // Convert string YYYY-MM-DD to dayjs
  const dayjsValue = value ? dayjs(value) : null;

  const handleChange = (date: dayjs.Dayjs | null) => {
    if (onChange) {
      const dateString = date ? date.format('YYYY-MM-DD') : '';
      onChange({
        target: {
          value: dateString,
        },
      } as any);
    }
  };

  // Premium style matching CustomInput
  const baseClasses = "!w-full !px-3 !py-2 !text-sm !rounded-xl !border-2 !border-primary-900/50 !bg-transparent !text-primary-900 focus-within:!border-primary-500 focus-within:!shadow-[0_0_0_4px_rgba(14,165,233,0.2)] !transition-all !font-medium [&_.ant-picker-input_input]:!text-primary-900 [&_.ant-picker-input_input]:!placeholder-primary-900/60 [&_.ant-picker-input_input]:!font-medium [&_.ant-picker-suffix]:!text-primary-900/50 [&_.ant-picker-clear]:!text-primary-900/50";

  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <DatePicker
      value={dayjsValue && dayjsValue.isValid() ? dayjsValue : undefined}
      onChange={handleChange}
      className={combinedClassName}
      placeholder={placeholder}
      format="DD/MM/YYYY"
      disabled={disabled}
      {...props}
    />
  );
};
export default CustomDatePicker;

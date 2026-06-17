"use client";

import React from "react";
import { Input, InputProps } from "antd";

export interface CustomInputProps extends Omit<InputProps, 'variant'> {
  isPassword?: boolean;
  variant?: "auth" | "search";
}

export const CustomInput: React.FC<CustomInputProps> = ({
  isPassword = false,
  variant = "auth",
  className = "",
  ...props
}) => {
  // Base classes that style the input / wrapper container to match standard design
  const baseClasses = variant === "search"
    ? "!w-full !px-4 !py-1.5 !text-sm !rounded-full !border !border-primary-900/20 !bg-transparent !text-primary-900 [&_input]:!text-primary-900 placeholder:!text-primary-900/50 [&_input]:placeholder:!text-primary-900/50 focus:!border-primary-500 focus:!shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus-within:!border-primary-500 focus-within:!shadow-[0_0_0_3px_rgba(14,165,233,0.15)] !transition-all !font-medium [&_input]:!font-medium"
    : "!w-full !px-4 !py-2.5 sm:!px-5 sm:!py-3.5 !text-sm sm:!text-base !rounded-xl !border-2 !border-primary-900/50 !bg-transparent !text-primary-900 [&_input]:!text-primary-900 placeholder:!text-primary-900/60 [&_input]:placeholder:!text-primary-900/60 focus:!border-primary-500 focus:!shadow-[0_0_0_4px_rgba(14,165,233,0.2)] focus-within:!border-primary-500 focus-within:!shadow-[0_0_0_4px_rgba(14,165,233,0.2)] !transition-all !font-medium [&_input]:!font-medium";
  
  const combinedClassName = `${baseClasses} ${className}`.trim();

  if (isPassword) {
    return <Input.Password className={combinedClassName} {...props} />;
  }

  return <Input className={combinedClassName} {...props} />;
};

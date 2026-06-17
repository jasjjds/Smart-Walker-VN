"use client";

import React from "react";
import { Button, ButtonProps } from "antd";
import { GoogleIcon, FacebookIcon } from "@/components/common/icons";

export interface CustomButtonProps extends Omit<ButtonProps, "type" | "variant"> {
  variant?: "login" | "register" | "google" | "google-sdk" | "facebook" | "primary-gradient";
  loadingText?: string;
  fullWidth?: boolean;
}



export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary-gradient",
  loadingText,
  fullWidth = true,
  children,
  className = "",
  loading = false,
  disabled = false,
  htmlType,
  ...props
}) => {
  // Return early for google-sdk variant, as it's a structural container for GIS iframe
  if (variant === "google-sdk") {
    return (
      <div className="w-full flex justify-center mt-0.5">
        <div id="google-login-btn" className="w-full flex justify-center min-h-[40px]"></div>
      </div>
    );
  }

  // Base Tailwind classes
  const widthClass = fullWidth ? "w-full" : "";

  // Choose styles based on variant
  let buttonClasses = "";
  let defaultChildren = children;
  let iconElement = props.icon;
  let antButtonType: ButtonProps["type"] = "default";
  let customStyle: React.CSSProperties = {};

  switch (variant) {
    case "login":
      buttonClasses = "!mt-1 !h-auto !py-2.5 sm:!py-3.5 !text-white !text-sm sm:!text-base !font-bold !rounded-xl hover:!opacity-90 hover:!shadow-lg !transition-all !duration-300 !border-none flex !items-center !justify-center disabled:!opacity-50 disabled:!text-white/70";
      defaultChildren = loading ? (loadingText || "ĐANG ĐĂNG NHẬP...") : "ĐĂNG NHẬP";
      antButtonType = "primary";
      customStyle = {
        background: "linear-gradient(to right, var(--color-primary-500), var(--color-primary-900))",
        border: "none",
      };
      break;

    case "register":
      buttonClasses = "!mt-1 !h-auto !py-2.5 sm:!py-3.5 !text-white !text-sm sm:!text-base !font-bold !rounded-xl hover:!opacity-90 hover:!shadow-lg !transition-all !duration-300 !border-none flex !items-center !justify-center disabled:!opacity-50 disabled:!text-white/70";
      defaultChildren = loading ? (loadingText || "ĐANG ĐĂNG KÝ...") : "ĐĂNG KÝ";
      antButtonType = "primary";
      customStyle = {
        background: "linear-gradient(to right, var(--color-primary-500), var(--color-primary-900))",
        border: "none",
      };
      break;

    case "primary-gradient":
      buttonClasses = "!h-auto !py-2.5 sm:!py-3.5 !text-white !text-sm sm:!text-base !font-bold !rounded-xl hover:!opacity-90 hover:!shadow-lg !transition-all !duration-300 !border-none flex !items-center !justify-center disabled:!opacity-50 disabled:!text-white/70";
      antButtonType = "primary";
      customStyle = {
        background: "linear-gradient(to right, var(--color-primary-500), var(--color-primary-900))",
        border: "none",
      };
      break;

    case "google":
      buttonClasses = "!h-auto !py-2.5 sm:!py-3.5 !bg-white !text-neutral-700 hover:!text-neutral-900 !text-sm sm:!text-base !font-semibold !rounded-xl !border-2 !border-neutral-200 hover:!border-neutral-400 hover:!shadow-md !transition-all !duration-300 flex !items-center !justify-center";
      iconElement = <GoogleIcon className="w-5 h-5" style={{ marginRight: 8 }} />;
      defaultChildren = children || "Đăng nhập với Google";
      break;

    case "facebook":
      buttonClasses = "!h-auto !py-2.5 sm:!py-3.5 !bg-[#1877F2] hover:!bg-[#166FE5] !text-white !text-sm sm:!text-base !font-semibold !rounded-xl !border-none hover:!shadow-lg !transition-all !duration-300 flex !items-center !justify-center disabled:!opacity-50";
      iconElement = <FacebookIcon className="w-5 h-5" style={{ marginRight: 8 }} />;
      defaultChildren = children || "Đăng nhập với Facebook";
      antButtonType = "primary";
      break;

    default:
      break;
  }

  // Combine widths, custom classes, and variant classes
  const combinedClassName = `${widthClass} ${buttonClasses} ${className}`.trim();

  return (
    <Button
      type={antButtonType}
      loading={loading}
      disabled={disabled || !!loading}
      htmlType={htmlType || (variant === "login" || variant === "register" ? "submit" : "button")}
      className={combinedClassName}
      icon={iconElement}
      style={{ ...customStyle, ...props.style }}
      {...props}
    >
      {defaultChildren}
    </Button>
  );
};

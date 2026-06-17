"use client";

import React from "react";
import { Layout, Row, Col } from "antd";

interface AuthLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  isLogin: boolean;
  isSolid: boolean;
  illustrationImageLogin?: string;
  illustrationImageRegister?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  leftContent,
  rightContent,
  isLogin,
  isSolid,
  illustrationImageLogin = "/auth_pic1.svg",
  illustrationImageRegister = "/auth_pic2.svg",
}) => {
  return (
    <Layout className="min-h-screen lg:h-screen lg:overflow-hidden w-full !bg-primary-50 relative overflow-hidden text-primary-900">
      <Layout.Content className="w-full h-full">
        <Row className="w-full h-full min-h-screen relative" align="stretch">
          {/* Register column (Left Column on Desktop) */}
          <Col xs={24} lg={12} className="relative min-h-screen lg:h-screen lg:overflow-hidden">
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-4 z-0 transition-all duration-500 !text-primary-900 ${
                !isLogin
                  ? "relative opacity-100"
                  : "absolute lg:relative opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
              }`}
            >
              {leftContent}
            </div>
          </Col>

          {/* Login column (Right Column on Desktop) */}
          <Col xs={24} lg={12} className="relative min-h-screen lg:h-screen lg:overflow-hidden">
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-4 z-0 transition-all duration-500 !text-primary-900 ${
                isLogin
                  ? "relative opacity-100"
                  : "absolute lg:relative opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
              }`}
            >
              {rightContent}
            </div>
          </Col>

          {/* Sliding illustration panel (Only on desktop screens) */}
          <div
            className={`hidden lg:block absolute inset-y-0 w-1/2 z-10 transition-transform duration-700 ease-in-out shadow-2xl ${
              isLogin ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="relative w-full h-full bg-[#eef1f5]">
              {/* Login Illustration */}
              <div
                className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 w-full h-full p-8 lg:p-12 ${
                  isLogin ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url('${illustrationImageLogin}')`,
                  backgroundColor: "#eef1f5",
                  backgroundOrigin: "content-box",
                }}
              />

              {/* Register Illustration */}
              <div
                className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 w-full h-full p-8 lg:p-12 ${
                  !isLogin ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url('${illustrationImageRegister}')`,
                  backgroundColor: "#eef1f5",
                  backgroundOrigin: "content-box",
                }}
              />

              {/* Decorative shadow gradient overlay */}
              <div className="absolute inset-0 h-full bg-gradient-to-t from-primary-900/10 to-transparent pointer-events-none" />

              {/* Solid transition color panel */}
              <div
                className={`absolute inset-0 h-full bg-primary-900 transition-opacity duration-300 ease-in-out ${
                  isSolid ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </Row>
      </Layout.Content>
    </Layout>
  );
};


import React from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Header } from "@/components/layout/Header";

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;

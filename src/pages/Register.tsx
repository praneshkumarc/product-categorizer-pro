
import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Header } from "@/components/layout/Header";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
};

export default Register;

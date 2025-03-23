
import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;

"use client";
import AuthForm from "@/components/common/AuthForm";

import React from "react";

const Login = () => {
  if(typeof window === "undefined") return null;

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <AuthForm />
    </div>
  );
};

export default Login;

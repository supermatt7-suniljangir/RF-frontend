"use client";
import React from "react";
import AuthForm from "@/components/common/AuthForm";
const Register = () => {
  if(typeof window === "undefined") return null;
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <AuthForm />
    </div>
  );
};

export default Register;

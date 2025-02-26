"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleLogin } from "@react-oauth/google";
import useGoogleLogin from "@/features/auth/useGoogleLogin";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/features/auth/useLogin";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/app/loading";

interface FormInputs {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
}

const AuthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const { isLoading, user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    mode: "onChange",
  });

  const { handleGoogleSuccess, handleGoogleError } = useGoogleLogin();
  const { auth } = useAuth();
  const password = watch("password");

  // Handle redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const onSubmit = async (data: FormInputs) => {
    await auth(data);
  };

  if (isLoading) return <Spinner />;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">
          Sign {isLogin ? "In" : "Up"} to Creativity Spotlight
        </h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full mx-auto">
          <GoogleLogin
            text={isLogin ? "signin_with" : "signup_with"}
            logo_alignment="center"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              or Sign {isLogin ? "In" : "Up"} with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {!isLogin && (
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">
              {isLogin ? "Username or Email" : "Email"}
            </Label>
            <Input
              id="email"
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <Button variant="link" className="text-sm font-semibold">
                  Forgot?
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        {isLogin ? (
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link
              href={
                redirectPath !== "/"
                  ? `/register?redirect=${redirectPath}`
                  : "/register"
              }
              className="ml-1 font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Already have an account?
            <Link
              href={
                redirectPath !== "/"
                  ? `/login?redirect=${redirectPath}`
                  : "/login"
              }
              className="ml-1 font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;